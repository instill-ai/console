import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "./types";

async function updateKnowledgeBaseMutation({
  payload,
  ownerId,
  kbId,
  accessToken,
}: {
  payload: {
    name: string;
    description?: string;
    tags?: string[];
  };
  ownerId: string;
  kbId: string;
  accessToken: string | null;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.put<{
    knowledgeBase: KnowledgeBase;
  }>(`/namespaces/${ownerId}/catalogs/${kbId}`, payload);
  return response.data.knowledgeBase;
}

export function useUpdateKnowledgeBase() {
  return useMutation({
    mutationFn: updateKnowledgeBaseMutation,
  });
}
