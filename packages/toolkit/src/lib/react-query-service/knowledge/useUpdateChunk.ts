import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstillAPIClient, Nullable } from "@instill-ai/toolkit";

export function useUpdateChunk() {
  const queryClient = useQueryClient();
  return useMutation<
    { chunk: any; ownerId: string; kbId: string },
    Error,
    {
      ownerId: string;
      kbId: string;
      chunkUid: string;
      payload: { retrievable: boolean };
      accessToken: Nullable<string>;
    }
  >({
    mutationFn: async ({ ownerId, kbId, chunkUid, payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.updateChunk({ chunkUid, payload });
      return { chunk: response.chunk, ownerId, kbId };
    },
    onSuccess: ({ chunk, ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["chunks", ownerId, kbId] });
      queryClient.invalidateQueries({ queryKey: ["chunk", ownerId, kbId, chunk.chunkUid] });
    },
  });
}