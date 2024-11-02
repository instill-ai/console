"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespaceCatalogSingleSourceOfTruthFile({
  fileUid,
  accessToken,
  enabled,
  catalogId,
  namespaceId,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  catalogId: string;
  namespaceId: string;
}) {
  return useQuery({
    queryKey:
      queryKeyStore.catalog.getUseNamespaceCatalogSingleSourceOfTruthFileQueryKey(
        {
          fileUid,
          catalogId,
          namespaceId,
        },
      ),
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
      const res =
        await client.catalog.getNamespaceCatalogSingleSourceOfTruthFile({
          namespaceId,
          catalogId,
          fileUid,
        });

      return Promise.resolve(res.sourceFile);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
