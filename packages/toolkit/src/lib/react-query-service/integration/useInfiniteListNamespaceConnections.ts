"use client";

import type { Nullable } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteListNamespaceConnections({
  namespaceId,
  accessToken,
  enabled,
  filter,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
}) {
  return useInfiniteQuery({
    queryKey:
      queryKeyStore.integration.getUseInfiniteListNamespaceConnectionsQueryKey({
        namespaceId,
        filter,
      }),
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res =
        await client.core.integration.listPaginatedNamespaceConnections({
          namespaceId,
          pageSize: 100,
          pageToken: pageParam ?? null,
          filter: filter ?? undefined,
        });

      return Promise.resolve(res);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPageToken === "") {
        return null;
      }

      return lastPage.nextPageToken;
    },
    enabled,
  });
}
