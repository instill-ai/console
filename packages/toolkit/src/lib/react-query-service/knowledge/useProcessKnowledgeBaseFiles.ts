import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { File } from "./types";

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
        `/catalogs/files/processAsync`,
        { file_uids: fileUids },
      );
      return response.data.files;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
