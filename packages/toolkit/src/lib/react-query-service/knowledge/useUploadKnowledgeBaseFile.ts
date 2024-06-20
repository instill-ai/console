import { useMutation } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/design-system";

export function useUploadKnowledgeBaseFile() {
  return useMutation({
    mutationFn: async ({
      ownerId,
      knowledgeBaseId,
      payload,
      accessToken,
    }: {
      ownerId: Nullable<string>;
      knowledgeBaseId: string;
      payload: {
        name: string;
        type: string;
        content: string;
      };
      accessToken: Nullable<string>;
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
