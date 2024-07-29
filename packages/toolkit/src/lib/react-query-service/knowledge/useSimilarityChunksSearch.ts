import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { SimilarityChunk } from "../../../../../sdk/src/vdp/artifact/types";
import { Nullable } from "@instill-ai/toolkit";


export function useSimilarityChunksSearch() {
  return useMutation<
    SimilarityChunk[],
    Error,
    {
      ownerId: string;
      kbId: string;
      payload: { textPrompt: string; topk: number };
      accessToken: Nullable<string>;
    }
  >({
    mutationFn: async ({ ownerId, kbId, payload, accessToken }) => {
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
