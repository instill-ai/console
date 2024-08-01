import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
import { File } from "./types";

export function useUploadKnowledgeBaseFile() {
  const queryClient = useQueryClient();

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
    }): Promise<File> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      if (!ownerId) {
        return Promise.reject(new Error("ownerId not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.uploadKnowledgeBaseFile({
        ownerId,
        kbId: knowledgeBaseId,
        payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
