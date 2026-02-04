"use client";

import type { Nullable, UploadNamespaceObjectRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

/**
 * Optional object info to confirm upload after MinIO upload completes.
 * When provided, the hook will call updateObject to mark the object as uploaded.
 */
interface ObjectConfirmInfo {
  /** Namespace ID (e.g., "my-namespace") */
  namespaceId: string;
  /** Object ID (e.g., "obj-abc123") - extracted from object.name */
  objectId: string;
  /** File size in bytes */
  size?: number;
  /** MIME content type */
  contentType?: string;
}

export function useUploadNamespaceObject() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
      shareToken,
      confirmUpload,
    }: {
      payload: UploadNamespaceObjectRequest;
      accessToken: Nullable<string>;
      /**
       * Share link token for public resource access.
       * Note: The actual upload goes to a presigned URL, so this token
       * is not needed for the upload itself, but kept for API consistency.
       */
      shareToken?: string;
      /**
       * Optional object info to confirm upload after MinIO upload completes.
       * When provided, calls updateObject to mark is_uploaded=true in the database.
       * This ensures the object record is correctly marked as uploaded.
       */
      confirmUpload?: ObjectConfirmInfo;
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

      // If object info provided, confirm the upload by calling updateObject
      if (confirmUpload && effectiveAccessToken) {
        try {
          await client.artifact.updateObject({
            namespaceId: confirmUpload.namespaceId,
            objectId: confirmUpload.objectId,
            object: {
              name: `namespaces/${confirmUpload.namespaceId}/objects/${confirmUpload.objectId}`,
              isUploaded: true,
              size: confirmUpload.size,
              contentType: confirmUpload.contentType,
            },
          });
        } catch (error) {
          // Log but don't fail the upload - backend has a fallback mechanism
          console.warn(
            "[useUploadNamespaceObject] Failed to confirm upload:",
            error,
          );
        }
      }

      return Promise.resolve(response);
    },
  });
}
