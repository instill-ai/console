import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstillAPIClient, Nullable } from "@instill-ai/toolkit";

export function useUpdateChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      kbId,
      chunkUid,
      payload,
      accessToken,
    }: {
      ownerId: string;
      kbId: string;
      chunkUid: string;
      payload: { retrievable: boolean };
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const response = await client.vdp.knowledgeBase.updateChunk({ chunkUid, payload });

      return Promise.resolve({ chunk: response.chunk, ownerId, kbId });
    },
    onSuccess: async ({ chunk, ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["chunks", ownerId, kbId] });
      queryClient.invalidateQueries({ queryKey: ["chunk", ownerId, kbId, chunk.chunkUid] });
    },
  });
}