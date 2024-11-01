"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

export function useGetCatalogSingleSourceOfTruthFile({
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
    queryKey: ["fileContent", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!fileUid) {
        throw new Error("fileUid not provided");
      }
      if (!catalogId) {
        throw new Error("catalogId not provided");
      }
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const fileContent =
        await client.catalog.getCatalogSingleSourceOfTruthFile({
          namespaceId,
          catalogId,
          fileUid,
        });

      return Promise.resolve(fileContent.sourceFile);
    },
    enabled: enabled && Boolean(accessToken) && Boolean(fileUid),
  });
}
