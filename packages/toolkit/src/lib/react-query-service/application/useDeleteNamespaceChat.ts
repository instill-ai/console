"use client";

import type { Chat, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatUid,
      namespaceId,
      accessToken,
    }: {
      chatUid: string;
      namespaceId: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!chatUid) {
        throw new Error("chatUid is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      await client.application.deleteNamespaceChat({
        chatUid,
        namespaceId,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Chat[]>(
        queryKeyStore.application.getUseListNamespaceChatsQueryKey({
          namespaceId: variables.namespaceId,
        }),
        (prev) => {
          if (!prev) return prev;
          return prev.filter((chat) => chat.uid !== variables.chatUid);
        },
      );
    },
  });
}
