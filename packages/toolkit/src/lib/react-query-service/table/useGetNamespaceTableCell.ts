"use client";

import { useQuery } from "@tanstack/react-query";
import { GetNamespaceTableCellRequest, WithNullableFields } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useGetNamespaceTableCell({
  accessToken,
  namespaceId,
  tableUid,
  enabled,
  rowUid,
  cellUid,
}: QueryBaseProps & WithNullableFields<GetNamespaceTableCellRequest>) {
  return useQuery({
    queryKey: queryKeyStore.table.getUseGetNamespaceTableCellQueryKey({
      namespaceId,
      tableUid,
      rowUid,
      cellUid,
    }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!tableUid) {
        throw new Error("tableUid is required");
      }

      if (!rowUid) {
        throw new Error("rowUid is required");
      }

      if (!cellUid) {
        throw new Error("cellUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.getNamespaceTableCell({
        namespaceId,
        tableUid,
        rowUid,
        cellUid,
      });

      return Promise.resolve(res.cell);
    },
    enabled:
      enabled &&
      Boolean(accessToken) &&
      Boolean(tableUid) &&
      Boolean(rowUid) &&
      Boolean(cellUid),
  });
}
