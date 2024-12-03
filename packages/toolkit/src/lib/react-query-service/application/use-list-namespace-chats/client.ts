"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespaceChats } from "./server";

export function useListNamespaceChats({
  accessToken,
  namespaceId,
  enabled,
}: {
  accessToken: Nullable<string>;
  namespaceId: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.application.getUseListNamespaceChatsQueryKey({
      namespaceId,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      const res = await fetchNamespaceChats({
        namespaceId,
        accessToken,
      });

      return Promise.resolve(res.chats);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
