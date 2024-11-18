"use client";

import type { DownloadNamespaceObjectRequest, Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

export function useDownloadNamespaceObject() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: DownloadNamespaceObjectRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response = await client.artifact.downloadNamespaceObject(payload);

      return Promise.resolve(response);
    },
  });
}
