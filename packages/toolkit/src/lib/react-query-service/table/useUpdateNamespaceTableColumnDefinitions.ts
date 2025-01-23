"use client";

import type {
  Nullable,
  UpdateNamespaceTableColumnDefinitionsRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceTableColumnDefinitions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceTableColumnDefinitionsRequest;
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

      const client = getInstillCatalogAPIClient({ accessToken });
      const res =
        await client.table.updateNamespaceTableColumnDefinitions(payload);
      return Promise.resolve(res.columnDefinitions);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.table.getUseGetNamespaceTableColumnDefinitionsQueryKey({
            namespaceId: variables.payload.namespaceId,
            tableUid: variables.payload.tableUid,
          }),
      });
    },
  });
}
