"use client";

import type { GetNamespaceObjectUploadURLRequest, Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";

export function useGetNamespaceObjectUploadURL() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: GetNamespaceObjectUploadURLRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const response =
        await client.artifact.getNamespaceObjectUploadURL(payload);

      return Promise.resolve(response);
    },
  });
}
