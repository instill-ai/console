import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

import { getInstillAPIClient } from "../../vdp-sdk";
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
      const client = getInstillAPIClient({ accessToken });
      const response = await client.vdp.artifact.processKnowledgeBaseFiles({
        fileUids,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
    },
  });
}
