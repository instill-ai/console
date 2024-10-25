"use client";

import type { Nullable } from "instill-sdk";
import { useInfiniteQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillModelAPIClient } from "../../vdp-sdk";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteModels({
  accessToken,
  enabledQuery,
  filter,
  visibility,
  orderBy,
  disabledViewFull,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  disabledViewFull?: boolean;
  filter: Nullable<string>;
  visibility: Nullable<string>;
  orderBy: Nullable<string>;
}) {
  return useInfiniteQuery({
    queryKey: queryKeyStore.model.getUseInfiniteModelsQueryKey({
      filter,
      visibility,
      orderBy,
    }),
    queryFn: async ({ pageParam }) => {
      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const models = await client.model.listModels({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        view: disabledViewFull ? "VIEW_FULL" : "VIEW_BASIC",
        pageToken: pageParam ?? null,
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
