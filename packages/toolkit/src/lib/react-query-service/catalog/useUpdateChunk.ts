import { getInstillCatalogAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useUpdateChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chunkUid,
      accessToken,
      retrievable,
      namespaceId,
      catalogId,
    }: {
      chunkUid: string;
      accessToken: Nullable<string>;
      retrievable: boolean;
      namespaceId: string;
      catalogId: string;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.updateChunk({
        namespaceId,
        catalogId,
        chunkUid,
        retrievable,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chunks", variables.catalogId],
      });
    },
  });
}