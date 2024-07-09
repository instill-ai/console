import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";

async function createKnowledgeBaseMutation({
  payload,
  ownerId,
  accessToken,
}: {
  payload: {
    name: string;
    description: string;
    tags?: string[];
  };
  ownerId: string;
  accessToken: string | null;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.post<{
    knowledge_base: KnowledgeBase;
  }>(`/owners/${ownerId}/knowledge-bases`, payload);
  return response.data.knowledge_base;
}

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: createKnowledgeBaseMutation,
  });
}
