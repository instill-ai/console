"use client";

import { signIn } from "next-auth/react";

import type { IntegrationProvider } from "./types";
import {
  OAuthCallbackConnectionIdQueryParam,
  OAuthCallbackIntegrationIdQueryParam,
  OAuthCallbackStatusQueryParam,
} from "../../constant";
import { TempIntegrationObjectKey } from "./core";

export async function initializeIntegrationConnection(
  provider: IntegrationProvider,
  connectionId: string,
  namespaceId: string,
  integrationId: string,
) {
  try {
    const setCookiePayload = {
      key: TempIntegrationObjectKey,
      value: JSON.stringify({
        provider,
        connectionId,
        namespaceId,
      }),
    };

    await fetch("/api/set-user-cookie", {
      method: "POST",
      body: JSON.stringify(setCookiePayload),
    });

    signIn(provider, {
      redirectTo:
        `/settings/integrations?${OAuthCallbackConnectionIdQueryParam}=` +
        connectionId +
        `&${OAuthCallbackIntegrationIdQueryParam}=` +
        integrationId +
        `&${OAuthCallbackStatusQueryParam}=` +
        "success",
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
