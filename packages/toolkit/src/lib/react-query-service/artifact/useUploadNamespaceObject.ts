"use client";

import type { Nullable, UploadNamespaceObjectRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

export function useUploadNamespaceObject() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UploadNamespaceObjectRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.artifact.uploadNamespaceObject(payload);

      return Promise.resolve(response);
    },
  });
}
