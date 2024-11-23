"use client";

import { Integration } from "instill-sdk";
import { signIn } from "next-auth/react";
import { z } from "zod";

import type { IntegrationProvider } from "./types";
import { resourceIdPrefix } from "../../constant";
import { formatResourceId } from "../../server";
import { createNaiveRandomString } from "../createNaiveRandomString";

export async function initializeIntegrationConnection({
  provider,
  namespaceId,
  redirectTo,
}: {
  provider: IntegrationProvider;
  namespaceId: string;
  redirectTo?: string;
}) {
  try {
    const tempIntegrationObject: TempIntegrationObject = {
      namespaceId,
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

    signIn(provider, { redirectTo });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export function isOAuthAvailable(integration: Integration) {
  return integration.oAuthConfig && integration.oAuthConfig.authUrl;
}

export function getPrefilledOAuthIntegrationConnectionId({
  provider,
  connectionIdentity,
}: {
  provider: IntegrationProvider;

  // This is the connection identity that is returned from the OAuth flow
  // For example, for GitHub, it is the user's GitHub username
  connectionIdentity: string;
}) {
  const naiveRandomString = createNaiveRandomString(3);
  const randomStringSuffix = `-${naiveRandomString}`;
  const maxIdentityLength = 32 - randomStringSuffix.length;
  const truncatedIdentity = `${provider}-${connectionIdentity}`.slice(
    0,
    maxIdentityLength,
  );

  return `${formatResourceId(truncatedIdentity, resourceIdPrefix.integrationConnection)}${randomStringSuffix}`;
}

export const TempIntegrationObjectSchema = z.object({
  namespaceId: z.string(),
});

export type TempIntegrationObject = z.infer<typeof TempIntegrationObjectSchema>;

export const TempIntegrationObjectKey = "instill_integration_connection_temp";
