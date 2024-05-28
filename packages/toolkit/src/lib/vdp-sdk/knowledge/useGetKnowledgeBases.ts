import { useMutation } from "@tanstack/react-query";
import { getKnowledgeBasesMutation } from "./knowledgeBaseMutations";

export function useGetKnowledgeBases() {
  return useMutation({
    mutationFn: async ({ accessToken }: { accessToken: string | null }) => {
      const knowledgeBases = await getKnowledgeBasesMutation({ accessToken });
      return knowledgeBases;
    },
  });
}
