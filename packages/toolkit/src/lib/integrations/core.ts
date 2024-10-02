import { AddIntegrationRequest, Nullable } from "instill-sdk";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SlackProvider from "next-auth/providers/slack";

import { getInstillAPIClient } from "../vdp-sdk";

export type GetAuthHandlerProps = {
  instillAccessToken?: string;
  namespaceId?: string;
  connectionId?: string;
  onCallback?: () => void;
};

export const TempIntegrationObjectKey = "instill_integration_connection_temp";

export function getAuthHandler({
  instillAccessToken,
  namespaceId,
  connectionId,
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
            scope: "repo read:user",
          },
        },
      }),
      GoogleProvider({
        clientId: String(process.env.GOOGLE_CLIENT_ID),
        clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
        authorization: {
          url: "https://accounts.google.com/o/oauth2/v2/auth",
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid",
          },
        },
      }),
      SlackProvider({
        clientId: String(process.env.SLACK_CLIENT_ID),
        clientSecret: String(process.env.SLACK_CLIENT_SECRET),
        authorization: {
          url: "https://slack.com/oauth/v2/authorize",
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            scope: "openid",
          },
        },
      }),
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (
          instillAccessToken &&
          account &&
          account.provider &&
          account.access_token &&
          namespaceId &&
          connectionId
        ) {
          let payload: Nullable<AddIntegrationRequest> = null;

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
              payload = {
                integrationId: "github",
                method: "METHOD_OAUTH",
                setup: {
                  token: account.access_token,
                },
                namespaceId,
                id: connectionId,
                oAuthAccessDetails: account,
              };
              break;
            }
            case "slack": {
              payload = {
                integrationId: "slack",
                method: "METHOD_OAUTH",
                setup: {
                  token: account.access_token,
                },
                namespaceId,
                id: connectionId,
                oAuthAccessDetails: account,
              };
              break;
            }
          }

          const client = getInstillAPIClient({
            accessToken: instillAccessToken,
          });

          if (payload) {
            await client.core.integration.addIntegration(payload);
            if (onCallback) {
              onCallback();
            }
          }
        }
        return token;
      },
    },
  });
}
