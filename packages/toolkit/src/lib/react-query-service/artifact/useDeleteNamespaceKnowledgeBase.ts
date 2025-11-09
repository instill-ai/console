"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      knowledgeBaseId,
      accessToken,
    }: {
      namespaceId: string;
      knowledgeBaseId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      await client.artifact.deleteKnowledgeBase({
        namespaceId,
        knowledgeBaseId: knowledgeBaseId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBasesQueryKey(
            {
              namespaceId: variables.namespaceId,
            },
          ),
      });
    },
  });
}
