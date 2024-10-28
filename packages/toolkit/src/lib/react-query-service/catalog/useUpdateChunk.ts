import { getInstillCatalogAPIClient, useMutation, useQueryClient } from "@instill-ai/toolkit";
import { Nullable } from "instill-sdk";

export function useUpdateChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chunkUid,
      accessToken,
      retrievable,
    }: {
      chunkUid: string;
      accessToken: Nullable<string>;
      retrievable: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      await client.catalog.updateChunk({
        chunkUid,
        retrievable,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chunks", variables.chunkUid],
      });
    },
  });
}