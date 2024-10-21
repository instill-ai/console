# About console's integration connection

## Architecture

We use [next-auth](https://next-auth.js.org/) to handle the OAuth flow. There are two critical files that you should know:

1. [core.ts](/packages/toolkit/src/lib/integrations/core.ts): This file contains the logic to generate the OAuth url and the scopes for each integration.
2. [route.ts](/apps//console/src/app/api/integration/[...nextauth]/route.ts): This file contains the logic to handle the OAuth callback and the session logic.

In most case, you only need to edit the `core.ts` file. But in some scenario, you might need the `interceptor` to make sure the returned data obey the validation of NextAuth like Slack integration. In that case, please refer to the [route.ts](/apps/console/src/app/api/integration/[...nextauth]/route.ts) file. We will explain the `interceptor` logic in the following section.

## Normal OAuth Authorization Code Flow

NextAuth is by defaul built for `OIDC` flow, in plain text, it means `Sign in with <Provider>`. But in our case, we don't want to `Sign in with <Provider>`, we want to `Connect to <Provider>` to get the token and use it to access the user's data. 

So this use case creates extra challenges which demand contributor to know deeper about NextAuth. For example, the default `GitHub` provider follow the `oauth` flow, but the default `Slack` provider follow the `oidc` flow.

Let's take Slack integration as an example. It has this default configuration:

```ts
{
  id: "slack",
  name: "Slack",
  type: "oidc",
  issuer: "https://slack.com",
  checks: ["nonce"],
  style: { brandColor: "#611f69" },
  options,
}
```

The crucial part is the `type: "oidc"`, it tells NextAuth this is an OIDC flow and NextAuth will try to encrypt the `idToken` payload and verify it with the `issuer`. We don't want this flow. And on the other hand, due to the default Slack configuration it use `oidc` flow, it will call the Slack's OIDC endpoint to get the token (https://slack.com/api/openid.connect.token)

This is the result with the default configuration.

```ts
{
  ok: true,
  access_token: '...',
  token_type: 'bearer',
  id_token: '...',
  warning: 'superfluous_charset',
  response_metadata: { warnings: [ 'superfluous_charset' ] },
  provider: 'slack',
  type: 'oidc',
  providerAccountId: '...'
}
```

But what we want is like this:

```ts
{
  "ok": true,
  "access_token": "xoxb-17653672481-19874698323-pdFZKVeTuE8sk7oOcBrzbqgy",
  "token_type": "bot",
  "scope": "commands,incoming-webhook",
  "bot_user_id": "U0KRQLJ9H",
  "app_id": "A0KRD7HC3",
  "team": {
      "name": "Slack Pickleball Team",
      "id": "T9TK3CUKW"
  },
  "enterprise": {
      "name": "slack-pickleball",
      "id": "E12345678"
  },
  "authed_user": {
      "id": "U1234",
      "scope": "chat:write",
      "access_token": "xoxp-1234",
      "token_type": "user"
  }
}
```

To get the result we want, we need to create a custom OAuth provider. And use interceptor to change the default behavior.

### Create a custom OAuth provider

Before the implementation, please read through the provider's OAuth guideline, take Slack as an example, the guideline is [here](https://api.slack.com/authentication/oauth-v2).

We can understand some crucial points from the guideline:

1. The authorization url is `https://slack.com/oauth/v2/authorize`
2. The token url is `https://slack.com/api/oauth.v2.access`
3. The Slack has `bot_token` and `user_token`. In general, without providing the user_scope, the endpoint will only return the `user_token`. 
4. The user info won't be included in the response of token url, we need to call another endpoint to get the user info. And the endpoint is `https://slack.com/api/users.info`

With these information, we can create a custom OAuth provider like this:

```ts
{
  id: "slack",
  name: "Slack",
  type: "oauth",
  clientId: String(process.env.SLACK_CLIENT_ID),
  clientSecret: String(process.env.SLACK_CLIENT_SECRET),
  authorization: {
    url: "https://slack.com/oauth/v2/authorize",
    params: {
      scope: "..."
      user_scope: "..."
      granular_bot_scope: "1",
    },
  },
  token: "https://slack.com/api/oauth.v2.access",
  userinfo: {
    url: "https://slack.com/api/users.info",
    async request({ tokens }: { tokens: any; provider: any }) {
      const profile = await fetch(
        `https://slack.com/api/users.info?user=${tokens.authed_user.id}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        },
      ).then(async (res) => await res.json());

      return profile.user;
    },
  },
}
```

Some key points:

1. We need to provide the `user_scope` in the authorization url, otherwise, the endpoint will only return the `user_token`. When implementing this details, please consult the maintainer of the component to better understand the logic.
2. We use userInfo callback to get the user info. And it will be stored in the `profile` object.

But then we will encounter another problem, the NextAuth is complainting that the return of token url is using the wrong `token_type: bot` instead of `bearer`.

To solve this problem, we need to create a custom `interceptor` to change the default behavior.

### Create a custom interceptor

The concept of interceptor is pretty simple, it override the default `fetch` behavior wiht the same fetch, but within the function we add some custom logic.

Let's take the Slack integration as an example.

```ts
export const slackAccessTokenInterceptor =
  (originalFetch: typeof fetch) =>
async (
  url: Parameters<typeof fetch>[0],
  options: Parameters<typeof fetch>[1] = {},
) => {
  if (
    url === "https://slack.com/api/oauth.v2.access" &&
    options.method === "POST"
  ) {
    const response = await originalFetch(url, options);

    // Clone the response to be able to modify it
    const clonedResponse = response.clone();
    const body = await clonedResponse.json();

    // Since we use the https://slack.com/api/oauth.v2.access, the token_type is not bearer but "bot"
    // but next-auth expect the token_type to be bearer
    body.token_type = "bearer";

    // Create a new response with the modified body
    const modifiedResponse = new Response(JSON.stringify(body), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Add the original url to the response
    return Object.defineProperty(modifiedResponse, "url", {
      value: response.url,
    });
  }

  return originalFetch(url, options);
};
```

Some key points:

1. We only change the behavior when the url is `https://slack.com/api/oauth.v2.access` and the method is `POST`.
2. We clone the response and modify the body. (Be careful not to use the original response, because it should be consumed by the NextAuth)
3. We override the `token_type` to `bearer`, just to obey the NextAuth's validation. Since we don't have any user's Session stored, this will not be a critical issue.

And then we adapt this interceptor in the [route.ts](/apps/console/src/app/api/integration/[...nextauth]/route.ts) file.

```ts
if (url.pathname === "/api/integration/callback/slack") {
  /* Intercept the fetch request to patch access_token request to be oauth compliant */
  global.fetch = slackAccessTokenInterceptor(fetch);
  const response = handler.handlers.GET(req);
  global.fetch = fetch;
  return response;
}
```

Some key points:

1. We only intercept the request when the url pathname is `/api/integration/callback/slack`.
2. We replace the global `fetch` with our interceptor.
3. After getting the response, we restore the global `fetch` to the original one.

Now the Slack integration should work as expected.