"use client";

import type { DeleteNamespaceTableRowRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceTableRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: DeleteNamespaceTableRowRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.tableUid) {
        throw new Error("tableUid is required");
      }

      if (!payload.rowUid) {
        throw new Error("rowUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.table.deleteNamespaceTableRow(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.table.getUseListNamespaceTableRowsQueryKey({
          namespaceId: variables.payload.namespaceId,
          tableUid: variables.payload.tableUid,
        }),
      });
    },
  });
}
