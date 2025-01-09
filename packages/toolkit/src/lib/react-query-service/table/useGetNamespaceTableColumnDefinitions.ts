"use client";

import { useQuery } from "@tanstack/react-query";
import { GetNamespaceTableRequest, WithNullableFields } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useGetNamespaceTableColumnDefinitions({
  accessToken,
  namespaceId,
  tableUId,
  enabled,
}: QueryBaseProps & WithNullableFields<GetNamespaceTableRequest>) {
  return useQuery({
    queryKey:
      queryKeyStore.table.getUseGetNamespaceTableColumnDefinitionsQueryKey({
        namespaceId,
        tableUId,
      }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!tableUId) {
        throw new Error("tableUId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.getNamespaceTable({
        namespaceId,
        tableUId,
      });

      return Promise.resolve(res.table);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(tableUId),
  });
}
