"use client";

import { useQuery } from "@tanstack/react-query";
import { ListNamespaceTableRowsRequest, WithNullableFields } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useListNamespaceTableRows({
  accessToken,
  namespaceId,
  tableUId,
  enabled,
  pageSize,
  pageToken,
  filter,
  sort,
  datetime,
}: QueryBaseProps & WithNullableFields<ListNamespaceTableRowsRequest>) {
  return useQuery({
    queryKey: queryKeyStore.table.getUseListNamespaceTableRowsQueryKey({
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
      const res = await client.table.listNamespaceTableRows({
        namespaceId,
        tableUId,
        pageToken: pageToken ?? undefined,
        pageSize: pageSize ?? undefined,
        filter: filter ?? undefined,
        sort: sort ?? undefined,
        datetime: datetime ?? undefined,
      });

      return Promise.resolve(res.rows);
    },
    enabled: enabled && Boolean(accessToken),
  });
}
