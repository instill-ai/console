import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useDeleteKnowledgeBaseFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUid,
      accessToken,
    }: {
      fileUid: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      await client.delete(`/catalogs/files?fileUid=${fileUid}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
