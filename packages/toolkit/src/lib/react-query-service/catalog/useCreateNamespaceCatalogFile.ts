"use client";

import type { CreateNamespaceCatalogFileRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceCatalogFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceCatalogFileRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.catalogId) {
        throw new Error("catalogId is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.createNamespaceCatalogFile(payload);

      return Promise.resolve(res.file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.catalog.getUseListNamespaceCatalogFilesQueryKey(
          {
            namespaceId: variables.payload.namespaceId,
            catalogId: variables.payload.catalogId,
          },
        ),
      });
    },
  });
}
