"use client";

import type { CreateKnowledgeBaseRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillArtifactAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceKnowledgeBase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateKnowledgeBaseRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!payload.id) {
        throw new Error("payload.id is required");
      }

      const client = getInstillArtifactAPIClient({ accessToken });
      const res = await client.artifact.createKnowledgeBase(payload);
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
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.chat.getUseGetChatAvailableContextsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
