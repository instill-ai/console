"use client";

import type { Chat, Nullable, UpdateNamespaceChatRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespaceChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceChatRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      if (!payload.namespaceId) {
        throw new Error("namespaceId is required");
      }

      const client = getInstillApplicationAPIClient({ accessToken });
      const res = await client.application.updateNamespaceChat(payload);
      return Promise.resolve(res.chat);
    },
    onSuccess: (chat, variables) => {
      queryClient.setQueryData<Chat[]>(
        queryKeyStore.application.getUseListNamespaceChatsQueryKey({
          namespaceId: variables.payload.namespaceId,
        }),
        (prev) => {
          if (!prev) {
            return [chat];
          }

          return [
            ...prev.filter((chat) => chat.uid !== variables.payload.chatUid),
            chat,
          ];
        },
      );
    },
  });
}
