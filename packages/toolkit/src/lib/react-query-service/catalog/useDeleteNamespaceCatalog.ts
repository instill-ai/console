"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      catalogId,
      accessToken,
    }: {
      namespaceId: string;
      catalogId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!catalogId) {
        throw new Error("catalogId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.deleteNamespaceCatalog({ namespaceId, catalogId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogsQueryKey({
          namespaceId: variables.namespaceId,
        }),
      });
    },
  });
}
