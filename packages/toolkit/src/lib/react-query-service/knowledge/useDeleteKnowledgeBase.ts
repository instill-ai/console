
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { DeleteKnowledgeBaseRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();
  return useMutation<
    { ownerId: string; kbId: string },
    Error,
    DeleteKnowledgeBaseRequest & { accessToken: Nullable<string> }
  >({
    mutationFn: async ({ ownerId, kbId, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      await client.artifact.deleteKnowledgeBase({ ownerId, kbId });
      return { ownerId, kbId };
    },
    onSuccess: ({ ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases", ownerId] });
      queryClient.removeQueries({ queryKey: ["knowledgeBase", ownerId, kbId] });
    },
  });
}