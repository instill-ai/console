import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";
import { File } from "../../vdp-sdk/knowledge/types";

export function useProcessKnowledgeBaseFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileUids,
      accessToken,
    }: {
      fileUids: string[];
      accessToken: Nullable<string>;
    }): Promise<File[]> => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.post<{ files: File[] }>(
        `/knowledge-bases/files/processAsync`,
        { file_uids: fileUids }
      );
      return response.data.files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}