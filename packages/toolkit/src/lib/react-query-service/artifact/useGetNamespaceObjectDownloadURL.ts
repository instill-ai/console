"use client";

import type {
  GetNamespaceObjectDownloadURLRequest,
  Nullable,
} from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

export function useGetNamespaceObjectDownloadURL() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: GetNamespaceObjectDownloadURLRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response =
        await client.artifact.getNamespaceObjectDownloadURL(payload);

      return Promise.resolve(response);
    },
  });
}
