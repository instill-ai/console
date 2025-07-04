"use client";

import type { CreateNamespaceTableRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceTableRequest;
      accessToken: Nullable<string>;
      disableInvalidate?: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.id) {
        throw new Error("id is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.createNamespaceTable(payload);
      return Promise.resolve(res.table);
    },
    onSuccess: (_, variables) => {
      if (variables.disableInvalidate) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryKeyStore.table.getUseListNamespaceTablesQueryKey({
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
