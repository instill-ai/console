import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";

export function useUploadKnowledgeBaseFile() {
  return useMutation({
    mutationFn: async ({
      ownerId,
      knowledgeBaseId,
      payload,
      accessToken,
    }: {
      ownerId: string;
      knowledgeBaseId: string;
      payload: {
        name: string;
        type: string;
        content: string;
      };
      accessToken: string | null;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.post(
        `/owners/${ownerId}/knowledge-bases/${knowledgeBaseId}/files`,
        payload
      );
      return response.data;
    },
  });
}
