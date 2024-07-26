import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";

async function deleteKnowledgeBaseMutation({
  ownerId,
  kbId,
  accessToken,
}: {
  ownerId: string;
  kbId: string;
  accessToken: string | null;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.delete<{
    knowledge_base: KnowledgeBase;
  }>(`/owners/${ownerId}/knowledge-bases/${kbId}`);
  return response.data.knowledge_base;
}

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: deleteKnowledgeBaseMutation,
  });
}
