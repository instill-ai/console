// lib/useUpdateKnowledgeBase.ts
import { useMutation } from "@tanstack/react-query";
import { KnowledgeBase } from "./knowledgeBase";
import { updateKnowledgeBaseMutation } from "./knowledgeBaseMutations";

export function useUpdateKnowledgeBase() {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
      accessToken,
    }: {
      id: string;
      payload: Partial<KnowledgeBase>;
      accessToken: string | null;
    }) => {
      const knowledgeBase = await updateKnowledgeBaseMutation({
        id,
        payload,
        accessToken,
      });
      return knowledgeBase;
    },
  });
}
