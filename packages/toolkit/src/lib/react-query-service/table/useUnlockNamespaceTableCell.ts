"use client";

import type { Nullable, UnlockNamespaceTableCellRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUnlockNamespaceTableCell() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UnlockNamespaceTableCellRequest;
      accessToken: Nullable<string>;
      disableInvalidate?: boolean;
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

      if (!payload.cellUid) {
        throw new Error("cellUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.table.unlockNamespaceTableCell(payload);
      return Promise.resolve();
    },
    onSuccess: (_, variables) => {
      if (variables.disableInvalidate) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryKeyStore.table.getUseListNamespaceTableRowsQueryKey({
          namespaceId: variables.payload.namespaceId,
          tableUid: variables.payload.tableUid,
        }),
      });
    },
  });
}
