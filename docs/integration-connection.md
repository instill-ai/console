# About console's integration connection

## Architecture

We use [next-auth](https://next-auth.js.org/) to handle the OAuth flow. There are two critical files you should know:

1. [core.ts](/packages/toolkit/src/lib/integrations/core.ts): Contains the logic to generate the OAuth URL and scopes for each integration.
2. [route.ts](/apps/console/src/app/api/integration/[...nextauth]/route.ts): Handles the OAuth callback and session logic.

In most cases, you only need to edit the `core.ts` file. However, in some scenarios, you might need to use an `interceptor` to ensure the returned data complies with NextAuth's validation, like in the Slack integration. For such cases, refer to the [route.ts](/apps/console/src/app/api/integration/[...nextauth]/route.ts) file. We'll explain the `interceptor` logic in the following section.

## Normal OAuth Authorization Code Flow

NextAuth is built by default for the `OIDC` flow, which means "Sign in with <Provider>". However, in our case, we want to "Connect to <Provider>" to get the token and use it to access the user's data. 

This use case creates additional challenges that require contributors to have a deeper understanding of NextAuth. For example, the default `GitHub` provider follows the `oauth` flow, while the default `Slack` provider follows the `oidc` flow. You can find these information in the source code of NextAuth.

### The implementation flow

- Understand the underlined logic of the target component, and make sure the scopes is correct
- Understand the OAuth flow, additional logic for the target component
- Create a custom OAuth provider that satisfies the target component's OAuth flow
- Create a custom interceptor to change the default behavior if needed
- Double check the received token match the component's requirement

## How to implement the Slack integration

Let's take the Slack integration as an example. It has this default configuration:

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

The crucial part is `type: "oidc"`, which tells NextAuth this is an OIDC flow. NextAuth verifies the existing signature of the ID token using the issuer's public key or JSON Web Key Set (JWKS). Additionally, due to the default Slack configuration using the `oidc` flow, it will call Slack's OIDC endpoint to get the token (https://slack.com/api/openid.connect.token).

This is the result with the default configuration:

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

But what we want is this:

```ts
{
  "ok": true,
  "access_token": "...",
  "token_type": "bot",
  "scope": "...",
  "bot_user_id": "...",
  "app_id": "...",
  "team": {
    "name": "...",
    "id": "..."
  },
  "enterprise": {
    "name": "...",
    "id": "..."
  },
  "authed_user": {
    "id": "...",
    "scope": "...",
    "access_token": "...",
    "token_type": "user"
  }
}
```

To get the desired result, we need to create a custom OAuth provider and use an interceptor to change the default behavior.

### Create a custom OAuth provider

Before implementation, read through the provider's OAuth guidelines. For Slack, the guidelines are [here](https://api.slack.com/authentication/oauth-v2).

Key points from the guidelines:

1. The authorization URL is `https://slack.com/oauth/v2/authorize`
2. The token URL is `https://slack.com/api/oauth.v2.access`
3. Slack has `bot_token` and `user_token`. Generally, without providing the user_scope, the endpoint will only return the `user_token`.
4. User info isn't included in the token URL response; we need to call another endpoint to get it: `https://slack.com/api/users.info`

With this information, we can create a custom OAuth provider:

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
      scope: "...",
      user_scope: "...",
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

Key points:

1. Provide the `user_scope` in the authorization URL; otherwise, the endpoint will only return the `user_token`. Consult the component maintainer to better understand the logic when implementing these details.
2. Use the userInfo callback to get user info, which will be stored in the `profile` object.

However, NextAuth will complain that the token URL return uses the wrong `token_type: bot` instead of `bearer`.

To solve this, we need to create a custom `interceptor` to change the default behavior.

### Create a custom interceptor

The interceptor concept is simple: override the default `fetch` behavior with the same fetch, but add custom logic within the function.

Here's an example for the Slack integration:

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

    // Since we use https://slack.com/api/oauth.v2.access, the token_type is "bot" not "bearer"
    // but next-auth expects the token_type to be "bearer"
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

Key points:

1. Only change the behavior when the URL is `https://slack.com/api/oauth.v2.access` and the method is `POST`.
2. Clone the response and modify the body. (Be careful not to use the original response, as it should be consumed by NextAuth)
3. Override the `token_type` to `bearer` to comply with NextAuth's validation. Since we don't store any user Sessions, this isn't a critical issue.

Then adapt this interceptor in the [route.ts](/apps/console/src/app/api/integration/[...nextauth]/route.ts) file:

```ts
if (url.pathname === "/api/integration/callback/slack") {
  /* Intercept the fetch request to patch access_token request to be oauth compliant */
  global.fetch = slackAccessTokenInterceptor(fetch);
  const response = handler.handlers.GET(req);
  global.fetch = fetch;
  return response;
}
```

Key points:

1. Only intercept the request when the URL pathname is `/api/integration/callback/slack`.
2. Replace the global `fetch` with our interceptor.
3. After getting the response, restore the global `fetch` to the original one.

Now the Slack integration should work as expected.
