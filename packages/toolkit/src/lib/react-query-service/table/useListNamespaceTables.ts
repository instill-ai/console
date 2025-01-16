"use client";

import { useQuery } from "@tanstack/react-query";
import { ListNamespaceTablesRequest, WithNullableFields } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useListNamespaceTables({
  accessToken,
  namespaceId,
  enabled,
}: QueryBaseProps & WithNullableFields<ListNamespaceTablesRequest>) {
  return useQuery({
    queryKey: queryKeyStore.table.getUseListNamespaceTablesQueryKey({
      namespaceId,
    }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.listNamespaceTables({
        namespaceId,
      });

      return Promise.resolve(res.tables);
    },
    enabled: enabled && Boolean(accessToken),
  });
}
