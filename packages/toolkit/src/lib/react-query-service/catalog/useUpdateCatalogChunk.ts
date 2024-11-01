"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateCatalogChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      // Because the mutation reponse didn't have these information, but we need them to
      // update the cache, so we need to pass them in as variables.
      namespaceId,
      catalogId,
      fileUid,
      chunkUid,
      accessToken,
      retrievable,
    }: {
      namespaceId: Nullable<string>;
      catalogId: Nullable<string>;
      fileUid: Nullable<string>;
      chunkUid: Nullable<string>;
      accessToken: Nullable<string>;
      retrievable: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!chunkUid) {
        throw new Error("chunkUid is required");
      }

      if (retrievable === undefined || retrievable === null) {
        throw new Error("retrievable flag is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.updateCatalogChunk({
        chunkUid,
        retrievable,
      });

      return Promise.resolve({
        namespaceId,
        catalogId,
        fileUid,
        response: res,
      });
    },
    onSuccess: ({ namespaceId, catalogId, fileUid }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.catalog.getUseListNamespaceCatalogChunksQueryKey({
            namespaceId,
            catalogId,
            fileUid,
            chunkUids: null,
          }),
      });
    },
  });
}
