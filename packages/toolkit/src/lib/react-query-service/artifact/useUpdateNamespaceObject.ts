"use client";

import type { Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

type UpdateNamespaceObjectPayload = {
  namespaceId: string;
  objectId: string;
  /** Mark the object as uploaded (file exists in storage) */
  isUploaded?: boolean;
  /** File size in bytes */
  size?: number;
  /** MIME content type */
  contentType?: string;
};

/**
 * Hook to update a namespace object's metadata.
 * Commonly used to mark an object as uploaded after direct MinIO upload.
 */
export function useUpdateNamespaceObject() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceObjectPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken required"));
      }

      // Validate namespace before API call
      if (
        !payload.namespaceId ||
        payload.namespaceId.includes("undefined") ||
        payload.namespaceId.includes("null")
      ) {
        console.error(
          "[useUpdateNamespaceObject] BLOCKED: Invalid namespaceId",
          { namespaceId: payload.namespaceId },
        );
        return Promise.reject(
          new Error(`Invalid namespace: ${payload.namespaceId}`),
        );
      }

      const client = getInstillArtifactAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.artifact.updateObject({
        namespaceId: payload.namespaceId,
        objectId: payload.objectId,
        object: {
          name: `namespaces/${payload.namespaceId}/objects/${payload.objectId}`,
          isUploaded: payload.isUploaded,
          size: payload.size,
          contentType: payload.contentType,
        },
      });

      return Promise.resolve(response);
    },
  });
}
