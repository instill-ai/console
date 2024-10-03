"use client";

import { signIn } from "next-auth/react";
import { z } from "zod";

import type { IntegrationProvider } from "./types";
import { AvailableOAuthIntegration } from "../../constant";

export async function initializeIntegrationConnection({
  provider,
  namespaceId,
  integrationId,
}: {
  provider: IntegrationProvider;
  namespaceId: string;
  integrationId: string;
}) {
  try {
    const tempIntegrationObject: TempIntegrationObject = {
      provider,
      namespaceId,
      integrationId,
    };

    // We use this IntegrationObject to temporarily store the provider, namespaceId
    // and then use it in the /api/integration/[...nextauth]/route.ts
    const setCookiePayload = {
      key: TempIntegrationObjectKey,
      value: JSON.stringify(tempIntegrationObject),
    };

    await fetch("/api/set-user-cookie", {
      method: "POST",
      body: JSON.stringify(setCookiePayload),
    });

    signIn(provider);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export function isOAuthAvailable(integrationId: string) {
  return AvailableOAuthIntegration.includes(integrationId);
}

export function getPrefilledOAuthIntegrationConnectionId({
  provider,
  connectionIdentity,
  index,
}: {
  provider: IntegrationProvider;

  // This is the connection identity that is returned from the OAuth flow
  // For example, for GitHub, it is the user's GitHub username
  connectionIdentity: string;
  index: number;
}) {
  return `${connectionIdentity}-${provider}-connection-#${index}`;
}

export const TempIntegrationObjectSchema = z.object({
  provider: z.string(),
  namespaceId: z.string(),
  integrationId: z.string(),
});

export type TempIntegrationObject = z.infer<typeof TempIntegrationObjectSchema>;

export const TempIntegrationObjectKey = "instill_integration_connection_temp";
