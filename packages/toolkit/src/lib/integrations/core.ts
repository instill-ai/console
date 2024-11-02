/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CreateNamespaceConnectionRequest,
  InstillAPIClient,
  Nullable,
} from "instill-sdk";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { getPrefilledOAuthIntegrationConnectionId } from "./helpers";

export type GetAuthHandlerProps = {
  instillAccessToken?: string;
  namespaceId?: string;
  onCallback?: () => void;
};

const slackScopes = [
  "channels:history",
  "channels:read",
  "chat:write",
  "groups:history",
  "groups:read",
  "users.profile:read",
  "users:read",
  "users:read.email",
];

const googleDriveScopes = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const githubScopes = ["repo", "write:repo_hook", "user:email", "read:user"];

export function getAuthHandler({
  instillAccessToken,
  namespaceId,
  onCallback,
}: GetAuthHandlerProps) {
  return NextAuth({
    providers: [
      {
        id: "slack",
        name: "Slack",
        type: "oauth",
        clientId: String(process.env.INTEGRATION_SLACK_CLIENT_ID),
        clientSecret: String(process.env.INTEGRATION_SLACK_CLIENT_SECRET),
        authorization: {
          url: "https://slack.com/oauth/v2/authorize",
          params: {
            scope: slackScopes.join(" "),
            user_scope: slackScopes.join(" "),
            granular_bot_scope: "1",
          },
        },
        token: "https://slack.com/api/oauth.v2.access",
        userinfo: {
          url: "https://slack.com/api/users.info",
          async request({ tokens }: { tokens: any }) {
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
      },
      GoogleProvider({
        id: "google-drive",
        clientId: String(process.env.INTEGRATION_GOOGLE_DRIVE_CLIENT_ID),
        clientSecret: String(
          process.env.INTEGRATION_GOOGLE_DRIVE_CLIENT_SECRET,
        ),
        authorization: {
          url: "https://accounts.google.com/o/oauth2/auth",
          params: {
            scope: googleDriveScopes.join(" "),
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
      GitHubProvider({
        clientId: String(process.env.INTEGRATION_GITHUB_CLIENT_ID),
        clientSecret: String(process.env.INTEGRATION_GITHUB_CLIENT_SECRET),
        authorization: {
          url: "https://github.com/login/oauth/authorize",
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: githubScopes.join(" "),
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        console.log("all", token, account, profile);
        try {
          if (
            instillAccessToken &&
            account &&
            account.provider &&
            account.access_token &&
            namespaceId &&
            profile
          ) {
            let payload: Nullable<CreateNamespaceConnectionRequest> = null;

            switch (account.provider) {
              case "google-drive": {
                const identity = profile.email ?? profile.name;

                if (!identity) {
                  throw new Error(
                    "Instill Integration Error: Google Drive user not found, can't get the identity",
                  );
                }

                const prefilledIntegrationConnectionId =
                  getPrefilledOAuthIntegrationConnectionId({
                    provider: "google-drive",
                    connectionIdentity: identity,
                  });

                payload = {
                  integrationId: "google-drive",
                  method: "METHOD_OAUTH",
                  setup: {
                    token: account.access_token,
                    "refresh-token": account.refresh_token,
                  },
                  namespaceId,
                  id: prefilledIntegrationConnectionId,
                  oAuthAccessDetails: {
                    ...account,
                    ...profile,
                  },
                  identity: identity,
                  scopes: googleDriveScopes,
                };
                break;
              }
              case "github": {
                const identity = profile.login as string | undefined;

                if (!identity) {
                  throw new Error(
                    "Instill Integration Error: GitHub user not found, can't get the identity",
                  );
                }

                const prefilledIntegrationConnectionId =
                  getPrefilledOAuthIntegrationConnectionId({
                    provider: "github",
                    connectionIdentity: identity,
                  });

                payload = {
                  integrationId: "github",
                  method: "METHOD_OAUTH",
                  setup: {
                    token: account.access_token,
                  },
                  namespaceId,
                  id: prefilledIntegrationConnectionId,
                  oAuthAccessDetails: {
                    ...account,
                    ...profile,
                  },
                  identity: identity,
                  scopes: githubScopes,
                };
                break;
              }
              case "slack": {
                const identity =
                  // the profile we get from slack is not typed
                  (profile.profile as any).email ??
                  profile.real_name ??
                  profile.name;

                if (!identity) {
                  throw new Error(
                    "Instill Integration Error: Slack user not found, can't get the identity",
                  );
                }

                const prefilledIntegrationConnectionId =
                  getPrefilledOAuthIntegrationConnectionId({
                    provider: "slack",
                    connectionIdentity: identity,
                  });

                if (!account.authed_user) {
                  throw new Error(
                    "Instill Integration Error: Slack user not found, can't get the authed_user object",
                  );
                }

                payload = {
                  integrationId: "slack",
                  method: "METHOD_OAUTH",
                  setup: {
                    "bot-token": account.access_token,
                    "user-token": (account.authed_user as any).access_token,
                  },
                  namespaceId,
                  id: prefilledIntegrationConnectionId,
                  oAuthAccessDetails: {
                    ...account,
                    ...profile,
                  },
                  identity: identity,
                  scopes: slackScopes,
                };
                break;
              }
            }

            const baseURL = `${
              process.env.NEXT_SERVER_API_GATEWAY_URL
            }/${process.env.NEXT_PUBLIC_GENERAL_API_VERSION}`;

            const client = new InstillAPIClient({
              baseURL,
              apiToken: instillAccessToken,
            });

            if (payload) {
              await client.core.integration.createNamespaceConnection(payload);

              if (onCallback) {
                onCallback();
              }
            }
          }
          return token;
        } catch (error) {
          console.error("Error in jwt callback:", error);
          return token;
        }
      },
    },
    trustHost: true,
    pages: {
      signIn: "/api/nextauth/redirect-signin-page",
      error: "/api/nextauth/redirect-error-page",
    },
  });
}

// https://github.com/nextauthjs/next-auth/issues/8868

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
