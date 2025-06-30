"use client";

import type {
  Nullable,
  SuggestNamespaceTableColumnDefinitionRequest,
} from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useSuggestNamespaceTableColumnDefinition() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: SuggestNamespaceTableColumnDefinitionRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res =
        await client.table.suggestNamespaceTableColumnDefinition(payload);
      return Promise.resolve(res);
    },
  });
}
