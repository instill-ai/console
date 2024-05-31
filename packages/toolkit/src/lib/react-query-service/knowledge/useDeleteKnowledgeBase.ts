import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useDeleteKnowledgeBase() {
  return useMutation({
    mutationFn: async ({
      id,
      accessToken,
    }: {
      id: string;
      accessToken: string | null;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken);
      const response = await client.delete<{
        error_msg: string;
        status_code: number;
      }>(`/v1alpha/knowledge-base/${id}`);
      return response.data;
    },
  });
}