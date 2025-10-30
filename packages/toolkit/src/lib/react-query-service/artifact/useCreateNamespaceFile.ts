"use client";

import type { CreateFileRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateFileRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.createFile(payload);

      return Promise.resolve(res.file);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseFilesQueryKey(
            {
              namespaceId: variables.payload.namespaceId,
              knowledgeBaseId: variables.payload.knowledgeBaseId,
            },
          ),
      });
    },
  });
}
