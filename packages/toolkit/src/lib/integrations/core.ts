import { AddIntegrationRequest, Nullable } from "instill-sdk";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    ],
    callbacks: {
      async jwt({ token, account }) {
        if (
          instillAccessToken &&
          account &&
          account.provider &&
          account.access_token &&
          account.refresh_token &&
          namespaceId &&
          connectionId
        ) {
          let payload: Nullable<AddIntegrationRequest> = null;

          switch (account.provider) {
            case "google": {
              payload = {
                integrationId: "google",
                method: "METHOD_OAUTH",
                setup: {
                  token: account.access_token,
                },
                namespaceId,
                id: connectionId,
                oAuthAccessDetails: account,
              };
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
