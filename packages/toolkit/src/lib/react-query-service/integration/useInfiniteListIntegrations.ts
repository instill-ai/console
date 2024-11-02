"use client";

import type { Nullable } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteListIntegrations({
  accessToken,
  enabled,
  filter,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
}) {
  return useInfiniteQuery({
    queryKey: queryKeyStore.integration.getUseInfiniteListIntegrationsQueryKey({
      filter,
    }),
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.core.integration.listPaginatedIntegrations({
        pageSize: 100,
        pageToken: pageParam ?? undefined,
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
