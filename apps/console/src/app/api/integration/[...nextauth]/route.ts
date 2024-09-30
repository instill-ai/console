import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Nullable } from "instill-sdk";

import {
  getAuthHandler,
  GetAuthHandlerProps,
  TempIntegrationObjectKey,
} from "@instill-ai/toolkit/server";

const getAuthHandlerProps = () => {
  const cookieStore = cookies();
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
    const tempIntegrationObject = JSON.parse(tempIntegrationObjectString);
    getAuthHandlerProps = {
      instillAccessToken: accessToken ?? undefined,
      namespaceId: tempIntegrationObject.namespaceId,
      connectionId: tempIntegrationObject.connectionId,
    };
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
    onCallback: () => {
      cookies().delete(TempIntegrationObjectKey);
    },
  });

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
