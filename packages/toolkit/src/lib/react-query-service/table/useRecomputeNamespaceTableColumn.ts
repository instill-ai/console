"use client";

import type {
  Nullable,
  RecomputeNamespaceTableColumnRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useRecomputeNamespaceTableColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: RecomputeNamespaceTableColumnRequest;
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

      if (!payload.columnUid) {
        throw new Error("columnUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.table.recomputeNamespaceTableColumn(payload);
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
