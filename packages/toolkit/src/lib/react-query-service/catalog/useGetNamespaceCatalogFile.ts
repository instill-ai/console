"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespaceCatalogFile({
  fileUid,
  accessToken,
  enabled,
  catalogId,
  namespaceId,
}: {
  fileUid: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: Nullable<string>;
  namespaceId: Nullable<string>;
}) {
  return useQuery({
    queryKey: queryKeyStore.catalog.getUseCatalogFileSummaryQueryKey({
      fileUid,
      catalogId,
      namespaceId,
    }),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!fileUid) {
        throw new Error("fileUid is required");
      }

      if (!catalogId) {
        throw new Error("catalogId is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.getNamespaceCatalogFile({
        namespaceId,
        catalogId,
        fileUid,
      });

      return Promise.resolve(res.file);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
