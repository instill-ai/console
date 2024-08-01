import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
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
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.post<{ file: File }>(
        `/namespaces/${ownerId}/catalogs/${knowledgeBaseId}/files`,
        payload,
      );
      return response.data.file;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
