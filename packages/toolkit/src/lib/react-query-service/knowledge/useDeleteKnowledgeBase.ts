import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/design-system";

async function deleteKnowledgeBaseMutation({
  id,
  accessToken,
}: {
  id: string;
  accessToken: Nullable<string>;
}): Promise<{ error_msg: string; status_code: number }> {
  if (!accessToken) {
    return Promise.reject(new Error("accessToken not provided"));
  }
  const client = createInstillAxiosClient(accessToken, true);
  const response = await client.delete<{
    error_msg: string;
    status_code: number;
  }>(`/knowledge-base/${id}`);
  return response.data;
}

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: deleteKnowledgeBaseMutation,
  });
}
