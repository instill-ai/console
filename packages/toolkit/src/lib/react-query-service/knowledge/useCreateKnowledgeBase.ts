import { useMutation } from "@tanstack/react-query";

import { KnowledgeBase } from "../../../../../sdk/src/knowledge/types";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

async function createKnowledgeBaseMutation({
  payload,
  ownerId,
  accessToken,
}: {
  payload: {
    name: string;
    description?: string;
    tags?: string[];
    ownerId: string;
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
  }>(`/namespaces/${ownerId}/knowledge-bases`, payload);
  return response.data.knowledge_base;
}

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: createKnowledgeBaseMutation,
  });
}
