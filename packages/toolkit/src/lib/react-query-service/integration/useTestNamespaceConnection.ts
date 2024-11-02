"use client";

import type { Nullable } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function useTestNamespaceConnection() {
  return useMutation({
    mutationFn: async ({
      namespaceId,
      connectionId,
      accessToken,
    }: {
      namespaceId: string;
      connectionId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.core.integration.testNamespaceConnection({
        namespaceId,
        connectionId,
      });

      return Promise.resolve(res);
    },
  });
}
