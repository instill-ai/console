"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useListNamespaceCatalogs({
  accessToken,
  namespaceId,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogsQueryKey({
      namespaceId,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const catalogs = await client.catalog.listNamespaceCatalogs({
        namespaceId,
      });

      return Promise.resolve(catalogs.catalogs);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
