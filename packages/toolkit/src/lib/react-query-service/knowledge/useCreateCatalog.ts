import { useMutation } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "./types";

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
    knowledgeBase: KnowledgeBase;
  }>(`/namespaces/${ownerId}/catalogs`, payload);
  return response.data.knowledgeBase;
}

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: createKnowledgeBaseMutation,
  });
}
