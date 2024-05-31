import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { KnowledgeBase } from "../../vdp-sdk/knowledge/types";

export function useCreateKnowledgeBase() {
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: {
        name: string;
        description: string;
        tags: string[];
      };
      accessToken: string | null;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken);
      const response = await client.post<{
        body: KnowledgeBase;
        error_msg: string;
        status_code: number;
      }>(`/knowledge-base`, payload);
      return response.data.body;
    },
  });
}