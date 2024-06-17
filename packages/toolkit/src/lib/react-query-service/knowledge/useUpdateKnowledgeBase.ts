import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";
import { Nullable } from "@instill-ai/design-system";

async function updateKnowledgeBaseMutation({
  id,
  payload,
  accessToken,
}: {
  id: string;
  payload: {
    name?: string;
    description?: string;
    tags?: string[];
    owner_name?: string;
  };
  accessToken: Nullable<string>;
}): Promise<KnowledgeBase> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.put<{
    body: KnowledgeBase;
    error_msg: string;
    status_code: number;
  }>(`/knowledge-base/${id}`, payload);
  return response.data.body;
}

export function useUpdateKnowledgeBase() {
  return useMutation({
    mutationFn: updateKnowledgeBaseMutation,
  });
}
