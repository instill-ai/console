import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Chunk } from "./types";

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

      const client = createInstillAxiosClient(accessToken, true);

      try {
        const response = await client.post(`/chunks/${chunkUid}`, {
          retrievable,
        });
        return response.data.chunk as Chunk;
      } catch (error) {
        console.error("Error updating chunk:", error);
        throw new Error("Failed to update chunk. Please try again later.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chunks"] });
    },
  });
}
