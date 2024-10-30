import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillCatalogAPIClient } from "../../sdk-helper";

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
      if (!chunkUid) {
        throw new Error("chunkUid not provided");
      }
      if (retrievable === undefined || retrievable === null) {
        throw new Error("retrievable flag must be provided");
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
