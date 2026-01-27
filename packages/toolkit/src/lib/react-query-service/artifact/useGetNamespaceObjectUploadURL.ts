"use client";

import type { Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

type GetNamespaceObjectUploadURLPayload = {
  parent: string;
  displayName: string;
  urlExpireDays?: number;
  lastModifiedTime?: string;
  objectExpireDays?: number;
};

export function useGetNamespaceObjectUploadURL() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
      shareToken,
      collectionUid,
      sharePermission,
      shareCreatorUid,
    }: {
      payload: GetNamespaceObjectUploadURLPayload;
      accessToken: Nullable<string>;
      /**
       * Share link token for public resource access.
       * When provided, allows anonymous file uploads to shared collections.
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
    }) => {
      // Either accessToken or shareToken is required
      if (!accessToken && !shareToken) {
        return Promise.reject(new Error("accessToken or shareToken required"));
      }

      // When using share token, don't send Authorization header (accessToken)
      // The Instill-Share-Token header is sufficient for authentication
      const effectiveAccessToken = shareToken
        ? undefined
        : (accessToken ?? undefined);

      const client = getInstillArtifactAPIClient({
        accessToken: effectiveAccessToken,
        shareToken,
        collectionUid,
        sharePermission,
        shareCreatorUid,
      });

      // Validate parent before API call
      if (
        !payload.parent ||
        payload.parent.includes("undefined") ||
        payload.parent.includes("null")
      ) {
        console.error(
          "[useGetNamespaceObjectUploadURL] BLOCKED: Invalid parent",
          { parent: payload.parent },
        );
        return Promise.reject(
          new Error(`Invalid namespace parent: ${payload.parent}`),
        );
      }

      const sdkPayload = {
        parent: payload.parent,
        displayName: payload.displayName,
        urlExpireDays: payload.urlExpireDays,
        lastModifiedTime: payload.lastModifiedTime,
        objectExpireDays: payload.objectExpireDays,
      };

      // Type assertion needed because the instill-sdk package type definitions
      // haven't been updated yet, but the API accepts the new format
      const response = await client.artifact.getNamespaceObjectUploadURL(
        sdkPayload as unknown as Parameters<
          typeof client.artifact.getNamespaceObjectUploadURL
        >[0],
      );

      return Promise.resolve(response);
    },
  });
}
