import { useMutation } from "@tanstack/react-query";
import { KnowledgeBase } from "./knowledgeBase";
import { createKnowledgeBaseMutation } from "./knowledgeBaseMutations";

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: Partial<KnowledgeBase>;
      accessToken: string | null;
    }) => {
      const knowledgeBase = await createKnowledgeBaseMutation({
        payload,
        accessToken,
      });
      return knowledgeBase;
    },
  });
}
