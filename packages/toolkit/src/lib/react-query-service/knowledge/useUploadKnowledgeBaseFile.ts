"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { UploadKnowledgeBaseFileRequest } from "../../../../../sdk/src/vdp/artifact/types";

export function useUploadKnowledgeBaseFile() {
  const queryClient = useQueryClient();
  return useMutation<
    { uploadedFile: any; ownerId: string; kbId: string },
    Error,
    { payload: UploadKnowledgeBaseFileRequest; accessToken: Nullable<string> }
  >({
    mutationFn: async ({ payload, accessToken }) => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      const uploadedFile = await client.vdp.artifact.uploadKnowledgeBaseFile(payload);
      return { uploadedFile, ownerId: payload.ownerId, kbId: payload.kbId };
    },
    onSuccess: ({ uploadedFile, ownerId, kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles", ownerId, kbId] });
    },
  });
}