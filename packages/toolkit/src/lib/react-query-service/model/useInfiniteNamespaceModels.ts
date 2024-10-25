"use client";

import type { Nullable, Visibility } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../vdp-sdk";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteNamespaceModels({
  namespaceId,
  accessToken,
  enabled,
  filter,
  visibility,
  orderBy,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  orderBy: Nullable<string>;
}) {
  return useInfiniteQuery({
    queryKey: queryKeyStore.model.getUseInfiniteNamespaceModelsQueryKey(
      namespaceId,
      filter,
      visibility,
      orderBy,
    ),
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      const models = await client.model.listNamespaceModels({
        namespaceId,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        pageToken: pageParam ?? null,
        filter: filter ?? undefined,
        visibility: visibility ?? undefined,
        orderBy: orderBy ?? undefined,
        enablePagination: true,
      });

      return Promise.resolve(models);
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
