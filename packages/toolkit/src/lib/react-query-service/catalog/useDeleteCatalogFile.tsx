"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUid,
      namespaceId,
      catalogId,
      accessToken,
    }: {
      fileUid: string;
      namespaceId: Nullable<string>;
      catalogId: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!fileUid) {
        throw new Error("fileUid is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.deleteCatalogFile({
        fileUid,
      });

      return Promise.resolve({
        namespaceId,
        catalogId,
      });
    },
    onSuccess: ({ namespaceId, catalogId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogFilesQueryKey(
          {
            namespaceId,
            catalogId,
          },
        ),
      });
    },
  });
}
