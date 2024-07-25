
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { DeleteKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ownerId,
      kbId,
      accessToken,
    }: DeleteKnowledgeBaseRequest & { accessToken: Nullable<string> }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      await client.vdp.knowledgeBase.deleteKnowledgeBase({ ownerId, kbId });
      return Promise.resolve({ ownerId, kbId });
    },
    onSuccess: async ({ ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", ownerId] });
      queryClient.removeQueries({ queryKey: ["knowledgeBase", ownerId, kbId] });
    },
  });
}