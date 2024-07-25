"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillArtifactAPIClient } from "../../vdp-sdk";
import { ProcessKnowledgeBaseFilesRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useProcessKnowledgeBaseFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: ProcessKnowledgeBaseFilesRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillArtifactAPIClient({ accessToken });

      await client.vdp.knowledgeBase.processKnowledgeBaseFiles(payload);

      return Promise.resolve({ knowledgeBaseName: payload.knowledgeBaseName });
    },
    onSuccess: async ({ knowledgeBaseName }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles", knowledgeBaseName] });
    },
  });
}