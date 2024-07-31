import { useMutation } from "@tanstack/react-query";

import { KnowledgeBase } from "../../../../../sdk/src/knowledge/types";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

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
    knowledgeBase: KnowledgeBase;
  }>(`/namespaces/${ownerId}/knowledge-bases/${kbId}`);
  return response.data.knowledgeBase;
}

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: deleteKnowledgeBaseMutation,
  });
}
