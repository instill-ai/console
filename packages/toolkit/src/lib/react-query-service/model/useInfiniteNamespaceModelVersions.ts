"use client";

import type { Nullable } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteNamespaceModelVersions({
  accessToken,
  enabledQuery,
  pageSize,
  namespaceId,
  modelId,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  pageSize: Nullable<number>;
  namespaceId: Nullable<string>;
  modelId: Nullable<string>;
}) {
  let enabled = false;

  if (namespaceId && modelId && enabledQuery) {
    enabled = true;
  }

  return useInfiniteQuery({
    queryKey: queryKeyStore.model.getUseInfiniteNamespaceModelVersionsQueryKey({
      namespaceId,
      modelId,
    }),
    queryFn: async ({ pageParam }) => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!modelId) {
        return Promise.reject(new Error("modelId not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const versions = await client.model.listNamespaceModelVersions({
        pageSize: pageSize ?? undefined,
        page: pageParam ?? undefined,
        enablePagination: true,
        namespaceId,
        modelId,
      });

      return Promise.resolve(versions);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const versionsLastPage = Math.max(
        Math.ceil(lastPage.totalSize / lastPage.pageSize) - 1,
        0,
      );

      if (lastPage.page >= versionsLastPage) {
        return null;
      }

      return lastPage.page + 1;
    },
    enabled,
  });
}
