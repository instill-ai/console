"use client";

import { useQuery } from "@tanstack/react-query";
import { GetNamespaceTableRequest, WithNullableFields } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useGetNamespaceTable({
  accessToken,
  namespaceId,
  tableUid,
  enabled,
}: QueryBaseProps & WithNullableFields<GetNamespaceTableRequest>) {
  return useQuery({
    queryKey: queryKeyStore.table.getUseGetNamespaceTableQueryKey({
      namespaceId,
      tableUid,
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

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.table.getNamespaceTable({
        namespaceId,
        tableUid,
      });

      return Promise.resolve(res.table);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(tableUid),
  });
}
