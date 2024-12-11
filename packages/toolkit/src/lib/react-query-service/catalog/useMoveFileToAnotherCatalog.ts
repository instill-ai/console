"use client";

import type { MoveFileToAnotherCatalogRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useMoveFileToAnotherCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: MoveFileToAnotherCatalogRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.catalog.moveFileToAnotherCatalog(payload);
      return Promise.resolve(res.fileUid);
    },
    onSuccess: (_, variables) => {
      // Invalidate all the catalogs files cache
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.catalog.getUseListNamespaceCatalogsFilesQueryKey({
            namespaceId: variables.payload.namespaceId,
            catalogIds: [],
          }),
      });
    },
  });
}
