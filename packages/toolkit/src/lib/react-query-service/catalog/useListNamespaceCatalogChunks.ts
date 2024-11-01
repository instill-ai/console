"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useListNamespaceCatalogChunks({
  accessToken,
  namespaceId,
  catalogId,
  fileUid,
  chunkUids,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  catalogId: Nullable<string>;
  fileUid: Nullable<string>;
  chunkUids: Nullable<string[]>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (enabled && accessToken && namespaceId && catalogId) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogChunksQueryKey({
      namespaceId,
      catalogId,
      fileUid,
      chunkUids,
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
      const res = await client.catalog.listNamespaceCatalogChunks({
        namespaceId,
        catalogId,
        fileUid: fileUid ?? undefined,
        chunkUids: chunkUids ?? undefined,
      });

      return Promise.resolve(res.chunks);
    },
    enabled: enabledQuery,
  });
}
