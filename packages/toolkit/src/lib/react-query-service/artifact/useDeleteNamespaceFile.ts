"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      namespaceId,
      knowledgeBaseId,
      accessToken,
    }: {
      fileId: string;
      namespaceId: Nullable<string>;
      knowledgeBaseId: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!fileId) {
        throw new Error("fileId is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });

      await client.artifact.deleteFile({
        namespaceId,
        knowledgeBaseId,
        fileId,
      });

      return Promise.resolve({
        namespaceId,
        knowledgeBaseId,
      });
    },
    onSuccess: ({ namespaceId, knowledgeBaseId }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseFilesQueryKey(
            {
              namespaceId,
              knowledgeBaseId,
            },
          ),
      });
    },
  });
}
