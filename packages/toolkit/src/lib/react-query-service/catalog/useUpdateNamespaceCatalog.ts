"use client";

import type { Nullable, UpdateNamespaceCatalogRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceCatalogRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId not provided");
      }

      if (!payload.catalogId) {
        throw new Error("catalogId not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalog = await client.catalog.updateNamespaceCatalog(payload);

      return Promise.resolve(catalog);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
