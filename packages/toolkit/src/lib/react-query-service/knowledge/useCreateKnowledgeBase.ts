import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";
import { Nullable } from "@instill-ai/design-system";

async function createKnowledgeBaseMutation({
  payload,
  accessToken,
}: {
  payload: {
    name: string;
    description: string;
    tags?: string[];
  };
  accessToken: Nullable<string>;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.post<{
    body: KnowledgeBase;
    error_msg: string;
    status_code: number;
  }>(`/knowledge-base`, payload);
  return response.data.body;
}

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: createKnowledgeBaseMutation,
  });
}
