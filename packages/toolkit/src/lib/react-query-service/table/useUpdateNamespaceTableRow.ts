"use client";

import type { Nullable, UpdateNamespaceTableRowRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceTableRow() {
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
      const res = await client.table.updateNamespaceTableRow(payload);
      return Promise.resolve(res.row);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.table.getUseListNamespaceTableRowsQueryKey({
          namespaceId: variables.payload.namespaceId,
          tableUId: variables.payload.tableUId,
        }),
      });
    },
  });
}
