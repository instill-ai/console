import { AddIntegrationRequest, Nullable } from "instill-sdk";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SlackProvider from "next-auth/providers/slack";

import { getInstillAPIClient } from "../vdp-sdk";
import { getPrefilledOAuthIntegrationConnectionId } from "./helpers";

export type GetAuthHandlerProps = {
  instillAccessToken?: string;
  namespaceId?: string;
  onCallback?: () => void;
  integrationId?: string;
};

export function getAuthHandler({
  instillAccessToken,
  namespaceId,
  onCallback,
  integrationId,
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
            scope: "repo user:email read:user",
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
        console.log("account", account);
        if (
          instillAccessToken &&
          account &&
          account.provider &&
          account.access_token &&
          namespaceId
        ) {
          let payload: Nullable<AddIntegrationRequest> = null;

          const client = getInstillAPIClient({
            accessToken: instillAccessToken,
          });

          // We now assume that user won't create more than 100 connections for a single integration
          const integrationConnections =
            await client.core.integration.getIntegrationConnections({
              namespaceId,
              filter: `integration_id="${integrationId}"`,
              pageSize: 100,
              enablePagination: false,
            });

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
                id: getPrefilledOAuthIntegrationConnectionId({
                  provider: "github",
                  connectionIdentity: account.userId as string,
                  index: integrationConnections.length,
                }),
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
                id: "",
                oAuthAccessDetails: account,
              };
              break;
            }
          }

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
