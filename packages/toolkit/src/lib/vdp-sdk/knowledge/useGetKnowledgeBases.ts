import { useMutation } from "@tanstack/react-query";
import { getKnowledgeBasesMutation } from "./knowledgeBaseMutations";

export function useGetKnowledgeBases() {
  return useMutation({
    mutationFn: async ({
      accessToken,
      uid,
    }: {
      accessToken: string | null;
      uid: string;
    }) => {
      const knowledgeBases = await getKnowledgeBasesMutation({
        accessToken,
        uid,
      });
      return knowledgeBases;
    },
  });
}