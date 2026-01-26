import { GeneralRecord, InstillAPIClient } from "instill-sdk";

import { env } from "../../server";

// Cache clients by their configuration to support different access/share tokens
const artifactClientCache = new Map<string, InstillAPIClient>();

export interface GetInstillArtifactAPIClientOptions {
  accessToken?: string;
  /**
   * Share link token for public resource access.
   * When provided, the Instill-Share-Token header is added to all requests.
   */
  shareToken?: string;
  /**
   * Collection UID for share link validation.
   * Required when using shareToken for file uploads to collections.
   */
  collectionUid?: string;
  /**
   * Permission type from the share link (e.g., "viewer", "editor").
   */
  sharePermission?: string;
  /**
   * Share link creator's UID for proper ownership tracking.
   * This identifies who authorized the upload via their share link.
   */
  shareCreatorUid?: string;
}

export function getInstillArtifactAPIClient({
  accessToken,
  shareToken,
  collectionUid,
  sharePermission,
  shareCreatorUid,
}: GetInstillArtifactAPIClientOptions) {
  const baseURL = `${
    process.env.NEXT_SERVER_API_GATEWAY_URL ??
    env("NEXT_PUBLIC_API_GATEWAY_URL")
  }/${env("NEXT_PUBLIC_ARTIFACT_API_VERSION")}`;

  // Create cache key based on all parameters
  const cacheKey = `${baseURL}:${accessToken ?? "anon"}:${shareToken ?? "no-share"}:${collectionUid ?? ""}:${shareCreatorUid ?? ""}`;

  // Return cached client if exists
  const cachedClient = artifactClientCache.get(cacheKey);
  if (cachedClient) {
    return cachedClient;
  }

  const userProvidedAdditionalHeaders: GeneralRecord = {};

  // Add Cloudflare Access headers if configured
  if (
    env("NEXT_PUBLIC_CF_ACCESS_CLIENT_ID") &&
    env("NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET")
  ) {
    userProvidedAdditionalHeaders["CF-Access-Client-Id"] = env(
      "NEXT_PUBLIC_CF_ACCESS_CLIENT_ID",
    );
    userProvidedAdditionalHeaders["CF-Access-Client-Secret"] = env(
      "NEXT_PUBLIC_CF_ACCESS_CLIENT_SECRET",
    );
  }

  // Add share link headers if provided
  if (shareToken) {
    userProvidedAdditionalHeaders["Instill-Share-Token"] = shareToken;
  }

  if (collectionUid) {
    userProvidedAdditionalHeaders["Instill-Collection-Uid"] = collectionUid;
  }

  if (sharePermission) {
    userProvidedAdditionalHeaders["Instill-Share-Permission"] = sharePermission;
  }

  if (shareCreatorUid) {
    userProvidedAdditionalHeaders["Instill-Share-Creator-Uid"] =
      shareCreatorUid;
  }

  const client = new InstillAPIClient({
    baseURL,
    apiToken: accessToken,
    userProvidedAdditionalHeaders:
      Object.keys(userProvidedAdditionalHeaders).length > 0
        ? userProvidedAdditionalHeaders
        : undefined,
  });

  // Cache the client
  artifactClientCache.set(cacheKey, client);

  // Limit cache size to prevent memory leaks
  if (artifactClientCache.size > 10) {
    const firstKey = artifactClientCache.keys().next().value;
    if (firstKey) {
      artifactClientCache.delete(firstKey);
    }
  }

  return client;
}
