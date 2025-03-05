"use client";

import type {
  ListNamespaceChatTablesRequest,
  WithNullableFields,
} from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillCatalogAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";
import { QueryBaseProps } from "../types";

export function useListNamespaceChatTables({
  accessToken,
  namespaceId,
  chatUid,
  enabled,
}: QueryBaseProps & WithNullableFields<ListNamespaceChatTablesRequest>) {
  return useQuery({
    queryKey: queryKeyStore.chat.getUseListNamespaceChatTablesQueryKey({
      namespaceId,
      chatUid,
    }),
    queryFn: async () => {
      if (!namespaceId) {
        throw new Error("namespaceId is required");
      }

      if (!chatUid) {
        throw new Error("chatUid is required");
      }

      if (!accessToken) {
        throw new Error("accessToken is required");
      }

      const client = getInstillCatalogAPIClient({ accessToken });
      const res = await client.chat.listNamespaceChatTables({
        namespaceId,
        chatUid,
      });

      return Promise.resolve(res.tables);
    },
    enabled: enabled && Boolean(namespaceId) && Boolean(accessToken),
  });
}
