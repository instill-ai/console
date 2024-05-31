import { useMutation } from "@tanstack/react-query";
import { deleteKnowledgeBaseMutation } from "./knowledgeBaseMutations";

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: async ({
      id,
      accessToken,
    }: {
      id: string;
      accessToken: string | null;
    }) => {
      await deleteKnowledgeBaseMutation({ id, accessToken });
    },
  });
}