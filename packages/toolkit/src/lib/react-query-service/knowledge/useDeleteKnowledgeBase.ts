import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      kbId,
      accessToken,
    }: {
      ownerId: string;
      kbId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      await client.vdp.artifact.deleteKnowledgeBase({ ownerId, kbId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });
}
