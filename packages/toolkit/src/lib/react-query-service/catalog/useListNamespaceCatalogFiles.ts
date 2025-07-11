"use client";

import type { File, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useListNamespaceCatalogFiles({
  namespaceId,
  catalogId,
  accessToken,
  enabled,
  refetchInterval,
}: {
  namespaceId: Nullable<string>;
  catalogId: Nullable<string>;
} & QueryBaseProps<File[]>) {
  return useQuery<File[]>({
    queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogFilesQueryKey({
      namespaceId,
      catalogId,
    }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!catalogId) {
        throw new Error("catalogId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.listNamespaceCatalogFiles({
        namespaceId,
        catalogId,
      });

      return Promise.resolve(res);
    },
    refetchInterval,
    enabled:
      enabled &&
      Boolean(namespaceId) &&
      Boolean(accessToken) &&
      Boolean(catalogId),
  });
}
