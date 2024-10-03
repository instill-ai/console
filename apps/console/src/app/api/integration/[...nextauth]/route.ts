import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Nullable } from "instill-sdk";

import {
  getAuthHandler,
  GetAuthHandlerProps,
  TempIntegrationObjectKey,
  TempIntegrationObjectSchema,
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
    try {
      const tempIntegrationObject = TempIntegrationObjectSchema.parse(
        JSON.parse(tempIntegrationObjectString),
      );
      getAuthHandlerProps = {
        instillAccessToken: accessToken ?? undefined,
        namespaceId: tempIntegrationObject.namespaceId,
        integrationId: tempIntegrationObject.integrationId,
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
