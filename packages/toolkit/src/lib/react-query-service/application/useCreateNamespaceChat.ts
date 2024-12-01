"use client";

import type { CreateNamespaceChatRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceChatRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      const res = await client.application.createNamespaceChat(payload);
      return Promise.resolve(res.chat);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.application.getUseListNamespaceChatsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
      });
    },
  });
}
