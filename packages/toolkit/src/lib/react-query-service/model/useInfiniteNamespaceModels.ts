"use client";

import type { Nullable, ResourceView, Visibility } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteNamespaceModels({
  namespaceId,
  accessToken,
  enabled,
  filter,
  visibility,
  orderBy,
  view,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  orderBy: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  return useInfiniteQuery({
    queryKey: queryKeyStore.model.getUseInfiniteNamespaceModelsQueryKey(
      namespaceId,
      filter,
      visibility,
      orderBy,
      view,
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
        pageToken: pageParam ?? undefined,
        filter: filter ?? undefined,
        visibility: visibility ?? undefined,
        orderBy: orderBy ?? undefined,
        enablePagination: true,
        view: view ?? undefined,
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
