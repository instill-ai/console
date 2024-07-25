import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { SimilarityChunk } from "../../../../../sdk/src/vdp/artifact/types";
import { Nullable } from "@instill-ai/toolkit";

export function useSimilarityChunksSearch() {
  return useMutation({
    mutationFn: async ({
      ownerId,
      kbId,
      payload,
      accessToken,
    }: {
      ownerId: string;
      kbId: string;
      payload: { textPrompt: string; topk: number };
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) throw new Error("accessToken not provided");
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.post<{ similarChunks: SimilarityChunk[] }>(
        `/namespaces/${ownerId}/knowledge-bases/${kbId}/chunks/similarity`,
        payload
      );
      return response.data.similarChunks;
    },
  });
}