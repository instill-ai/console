"use client";

import type { Nullable, UpdateKnowledgeBaseRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateKnowledgeBaseRequest;
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
      const res = await client.artifact.updateKnowledgeBase(payload);

      return Promise.resolve(res.knowledgeBase);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.knowledgeBase.getUseListNamespaceKnowledgeBasesQueryKey(
            {
              namespaceId: variables.payload.namespaceId,
            },
          ),
      });
    },
  });
}
