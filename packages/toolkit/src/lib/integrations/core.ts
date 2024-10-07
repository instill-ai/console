import { CreateIntegrationConnectionRequest, Nullable } from "instill-sdk";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import SlackProvider from "next-auth/providers/slack";

import { getInstillAPIClient } from "../vdp-sdk";
import { getPrefilledOAuthIntegrationConnectionId } from "./helpers";

export type GetAuthHandlerProps = {
  instillAccessToken?: string;
  namespaceId?: string;
  onCallback?: () => void;
};

export function getAuthHandler({
  instillAccessToken,
  namespaceId,
  onCallback,
}: GetAuthHandlerProps) {
  return NextAuth({
    providers: [
      GitHubProvider({
        clientId: String(process.env.GITHUB_CLIENT_ID),
        clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
        authorization: {
          url: "https://github.com/login/oauth/authorize",
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "repo write:repo_hook user:email read:user",
          },
        },
      }),
      SlackProvider({
        clientId: String(process.env.SLACK_CLIENT_ID),
        clientSecret: String(process.env.SLACK_CLIENT_SECRET),
        authorization: {
          url: "https://slack.com/oauth/v2/authorize",
          params: {
            scope:
              "users:read users:read.email users.profile:read channels:history groups:history chat:write",
            user_scope: "users:read users:read.email users.profile:read",
            granular_bot_scope: "1",
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account, profile }) {
        try {
          console.log(
            "account",
            instillAccessToken,
            namespaceId,
            account,
            profile,
          );
          if (
            instillAccessToken &&
            account &&
            account.provider &&
            account.access_token &&
            namespaceId &&
            profile
          ) {
            let payload: Nullable<CreateIntegrationConnectionRequest> = null;

            const identity =
              profile.email ??
              profile.name ??
              (profile.login as string | undefined) ??
              profile.id;

            switch (account.provider) {
              case "google": {
                // payload = {
                //   integrationId: "google",
                //   method: "METHOD_OAUTH",
                //   setup: {
                //     token: account.access_token,
                //   },
                //   namespaceId,
                //   id: connectionId,
                //   oAuthAccessDetails: account,
                // };
                payload = null;
                break;
              }
              case "github": {
                const prefilledIntegrationConnectionId =
                  getPrefilledOAuthIntegrationConnectionId({
                    provider: "github",
                    connectionIdentity: profile.login as string,
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
                  identity: identity ?? undefined,
                };
                break;
              }
              case "slack": {
                const prefilledIntegrationConnectionId =
                  getPrefilledOAuthIntegrationConnectionId({
                    provider: "github",
                    connectionIdentity: profile.email as string,
                  });

                // get user infor from slack

                // const slackUserInfo = await fetch(
                //   "https://slack.com/api/users.info",
                //   {
                //     headers: {
                //       Authorization: `Bearer ${account.access_token}`,
                //       "Content-Type": "application/json",
                //     },
                //     method: "POST",
                //     body: JSON.stringify({
                //       user: profile.email as string,
                //     }),
                //   },
                // );

                // if (user.ok) {
                //   identity =
                //     user.user?.profile?.email ??
                //     user.user?.name ??
                //     user.user?.id;
                // }

                if (!identity) {
                  throw new Error("Slack user not found");
                }

                payload = {
                  integrationId: "slack",
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
                  identity: identity ?? undefined,
                };
                break;
              }
            }

            console.log("payload", payload);

            const client = getInstillAPIClient({
              accessToken: instillAccessToken,
            });

            if (payload) {
              await client.core.integration.createIntegrationConnection(
                payload,
              );
              if (onCallback) {
                onCallback();
              }
            }
          }
          return token;
        } catch (error) {
          console.error("Error in jwt callback:", error);
          // You might want to handle the error differently or rethrow it
          // depending on your error handling strategy
          return token;
        }
      },
    },
    trustHost: true,
  });
}
