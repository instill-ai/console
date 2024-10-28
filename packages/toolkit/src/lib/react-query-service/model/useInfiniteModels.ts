"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteModels({
  accessToken,
  enabledQuery,
  filter,
  visibility,
  orderBy,
  view,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  filter: Nullable<string>;
  visibility: Nullable<string>;
  orderBy: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  return useInfiniteQuery({
    queryKey: queryKeyStore.model.getUseInfiniteModelsQueryKey({
      filter,
      visibility,
      orderBy,
      view,
    }),
    queryFn: async ({ pageParam }) => {
      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const models = await client.model.listModels({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? undefined,
        view: view ?? undefined,
        pageToken: pageParam ?? undefined,
        enablePagination: true,
        filter: filter ?? undefined,
        visibility: visibility ?? undefined,
        orderBy: orderBy ?? undefined,
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
    enabled: enabledQuery,
  });
}
