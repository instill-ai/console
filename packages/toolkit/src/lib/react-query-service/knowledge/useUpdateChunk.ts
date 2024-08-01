import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { Chunk } from "./types";

export function useUpdateChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chunkUid,
      retrievable,
      accessToken,
    }: {
      chunkUid: string;
      retrievable: boolean;
      accessToken: Nullable<string>;
    }): Promise<Chunk> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.updateChunk({
        chunkUid,
        retrievable,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chunks"] });
    },
  });
}
