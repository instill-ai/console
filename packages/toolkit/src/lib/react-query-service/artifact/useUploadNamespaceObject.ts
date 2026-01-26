"use client";

import type { Nullable, UploadNamespaceObjectRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

export function useUploadNamespaceObject() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
      shareToken,
    }: {
      payload: UploadNamespaceObjectRequest;
      accessToken: Nullable<string>;
      /**
       * Share link token for public resource access.
       * Note: The actual upload goes to a presigned URL, so this token
       * is not needed for the upload itself, but kept for API consistency.
       */
      shareToken?: string;
    }) => {
      // Either accessToken or shareToken is required
      if (!accessToken && !shareToken) {
        return Promise.reject(new Error("accessToken or shareToken required"));
      }

      // When using share token, don't send Authorization header (accessToken)
      const effectiveAccessToken = shareToken
        ? undefined
        : (accessToken ?? undefined);

      const client = getInstillArtifactAPIClient({
        accessToken: effectiveAccessToken,
        shareToken,
      });
      const response = await client.artifact.uploadNamespaceObject(payload);

      return Promise.resolve(response);
    },
  });
}
