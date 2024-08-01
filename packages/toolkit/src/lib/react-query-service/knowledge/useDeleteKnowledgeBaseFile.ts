import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useDeleteKnowledgeBaseFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ownerId,
      kbId,
      fileUid,
      accessToken,
    }: {
      ownerId: string;
      kbId: string;
      fileUid: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      await client.vdp.artifact.deleteKnowledgeBaseFile({
        ownerId,
        kbId,
        fileUid,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
