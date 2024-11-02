"use client";

import type { Nullable } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteListNamespaceConnectionReferencedPipelines({
  namespaceId,
  connectionId,
  accessToken,
  enabled,
  filter,
}: {
  namespaceId: Nullable<string>;
  connectionId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
}) {
  return useInfiniteQuery({
    queryKey:
      queryKeyStore.integration.getUseInfiniteListNamespaceConnectionReferencedPipelinesQueryKey(
        {
          namespaceId,
          connectionId,
          filter,
        },
      ),
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!connectionId) {
        return Promise.reject(new Error("connectionId not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res =
        await client.core.integration.listPaginatedNamespaceConnectionReferencedPipelines(
          {
            namespaceId,
            connectionId,
            pageSize: 100,
            pageToken: pageParam ?? undefined,
            filter: filter ?? undefined,
          },
        );

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
