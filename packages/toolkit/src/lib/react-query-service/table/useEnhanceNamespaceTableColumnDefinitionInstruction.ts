"use client";

import type {
  EnhanceNamespaceTableColumnDefinitionInstructionRequest,
  Nullable,
} from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useEnhanceNamespaceTableColumnDefinitionInstruction() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: EnhanceNamespaceTableColumnDefinitionInstructionRequest;
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
        await client.table.enhanceNamespaceTableColumnDefinitionInstruction(
          payload,
        );
      return Promise.resolve(res);
    },
  });
}
