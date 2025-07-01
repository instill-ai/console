"use client";

import type { CreateNamespaceCatalogRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceCatalogRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.name) {
        throw new Error("payload.name is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.createNamespaceCatalog(payload);
      return Promise.resolve(res.catalog);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.chat.getUseGetChatAvailableContextsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
