"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillApplicationAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

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

      const client = getInstillApplicationAPIClient({ accessToken });
      const res = await client.application.listNamespaceChats({
        namespaceId,
      });

      return Promise.resolve(res.chats);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
