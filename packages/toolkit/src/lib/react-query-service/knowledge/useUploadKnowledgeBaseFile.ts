"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { UploadKnowledgeBaseFileRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useUploadKnowledgeBaseFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UploadKnowledgeBaseFileRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }
      const client = getInstillAPIClient({ accessToken });
      const uploadedFile = await client.vdp.artifact.uploadKnowledgeBaseFile(payload);
      return Promise.resolve({ uploadedFile, ownerId: payload.ownerId, kbId: payload.kbId });
    },
    onSuccess: async ({ uploadedFile, ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles", ownerId, kbId] });
    },
  });
}
