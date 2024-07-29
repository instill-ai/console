"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { ProcessKnowledgeBaseFilesRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useProcessKnowledgeBaseFiles() {
  const queryClient = useQueryClient();
  return useMutation<
    { knowledgeBaseName: string },
    Error,
    { payload: ProcessKnowledgeBaseFilesRequest; accessToken: Nullable<string> }
  >({
    mutationFn: async ({ payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      await client.vdp.artifact.processKnowledgeBaseFiles(payload);
      return { knowledgeBaseName: payload.knowledgeBaseName };
    },
    onSuccess: ({ knowledgeBaseName }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles", knowledgeBaseName] });
    },
  });
}