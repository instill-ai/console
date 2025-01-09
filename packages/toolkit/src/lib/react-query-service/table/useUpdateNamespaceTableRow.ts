"use client";

import type { Nullable, UpdateNamespaceTableRowRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceTableRowRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.rowUId) {
        throw new Error("rowUId is required");
      }

      if (!payload.tableUId) {
        throw new Error("tableUId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.updateNamespaceTable(payload);
      return Promise.resolve(res.table);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.table.getUseListNamespaceTablesQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
