import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

async function deleteKnowledgeBaseMutation({
  id,
  accessToken,
}: {
  id: string;
  accessToken: string | null;
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