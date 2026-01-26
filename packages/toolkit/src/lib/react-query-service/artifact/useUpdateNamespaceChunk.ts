"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceChunk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      knowledgeBaseId,
      fileId,
      chunkId,
      accessToken,
      retrievable,
    }: {
      namespaceId: Nullable<string>;
      knowledgeBaseId: Nullable<string>;
      fileId: Nullable<string>;
      chunkId: Nullable<string>;
      accessToken: Nullable<string>;
      retrievable: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!chunkId) {
        throw new Error("chunkId is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      if (!fileId) {
        throw new Error("fileId is required");
      }

      if (retrievable === undefined || retrievable === null) {
        throw new Error("retrievable flag is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.updateChunk({
        namespaceId,
        knowledgeBaseId,
        fileId,
        chunkId,
        retrievable,
      });

      return Promise.resolve({
        namespaceId,
        knowledgeBaseId,
        fileId,
        response: res,
      });
    },
    onSuccess: ({ namespaceId, knowledgeBaseId, fileId }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseChunksQueryKey(
            {
              namespaceId,
              knowledgeBaseId,
              fileId,
              chunkIds: null,
            },
          ),
      });
    },
  });
}
