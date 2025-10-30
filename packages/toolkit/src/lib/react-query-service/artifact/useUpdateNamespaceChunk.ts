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
      fileUid,
      chunkUid,
      accessToken,
      retrievable,
    }: {
      namespaceId: Nullable<string>;
      knowledgeBaseId: Nullable<string>;
      fileUid: Nullable<string>;
      chunkUid: Nullable<string>;
      accessToken: Nullable<string>;
      retrievable: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!chunkUid) {
        throw new Error("chunkUid is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      if (retrievable === undefined || retrievable === null) {
        throw new Error("retrievable flag is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.updateChunk({
        namespaceId,
        knowledgeBaseId: knowledgeBaseId,
        chunkId: chunkUid,
        retrievable,
      });

      return Promise.resolve({
        namespaceId,
        knowledgeBaseId,
        fileUid,
        response: res,
      });
    },
    onSuccess: ({ namespaceId, knowledgeBaseId, fileUid }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBaseChunksQueryKey(
            {
              namespaceId,
              knowledgeBaseId,
              fileUid,
              chunkUids: null,
            },
          ),
      });
    },
  });
}
