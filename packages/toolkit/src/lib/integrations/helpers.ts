"use client";

import { signIn } from "next-auth/react";

import type { IntegrationProvider } from "./types";
import { TempIntegrationObjectKey } from "./core";

export async function initializeIntegrationConnection(
  provider: IntegrationProvider,
  connectionId: string,
  namespaceId: string,
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
        "/settings/integrations?connectionId=" +
        connectionId +
        "&provider=" +
        provider,
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
