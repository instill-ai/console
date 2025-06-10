import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { NextRequest } from "next/server";
import { Nullable } from "instill-sdk";

import {
  getAuthHandler,
  GetAuthHandlerProps,
  slackAccessTokenInterceptor,
  TempIntegrationObjectKey,
  TempIntegrationObjectSchema,
} from "@instill-ai/toolkit/server";

const getAuthHandlerProps = () => {
  const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies;
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  const tempIntegrationObjectString = cookieStore.get(
    TempIntegrationObjectKey,
  )?.value;

  let getAuthHandlerProps: Nullable<GetAuthHandlerProps> = null;

  if (tempIntegrationObjectString) {
    try {
      const tempIntegrationObject = TempIntegrationObjectSchema.parse(
        JSON.parse(tempIntegrationObjectString),
      );
      getAuthHandlerProps = {
        instillAccessToken: accessToken ?? undefined,
        namespaceId: tempIntegrationObject.namespaceId,
      };
    } catch (error) {
      console.error(error);
      getAuthHandlerProps = {
        instillAccessToken: accessToken ?? undefined,
      };
    }
  } else {
    getAuthHandlerProps = {
      instillAccessToken: accessToken ?? undefined,
    };
  }

  return getAuthHandlerProps;
};

export async function GET(req: NextRequest) {
  let authHandlerProps: Nullable<GetAuthHandlerProps> = null;

  try {
    authHandlerProps = getAuthHandlerProps();
  } catch (error) {
    console.error(error);
  }

  const handler = getAuthHandler({
    ...authHandlerProps,
  });

  const url = new URL(req.url);

  if (url.pathname === "/api/integration/callback/slack") {
    /* Intercept the fetch request to patch access_token request to be oauth compliant */
    global.fetch = slackAccessTokenInterceptor(fetch);
    const response = handler.handlers.GET(req);
    global.fetch = fetch;
    return response;
  }

  return handler.handlers.GET(req);
}

export async function POST(req: NextRequest) {
  let authHandlerProps: Nullable<GetAuthHandlerProps> = null;

  try {
    authHandlerProps = getAuthHandlerProps();
  } catch (error) {
    console.error(error);
  }

  const handler = getAuthHandler({
    ...authHandlerProps,
  });

  return handler.handlers.POST(req);
}
