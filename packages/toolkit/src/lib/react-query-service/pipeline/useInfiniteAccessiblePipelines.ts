"use client";

import type {
  ListAccessiblePipelineResponse,
  Nullable,
  ResourceView,
  Visibility,
} from "instill-sdk";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useInfiniteAccessiblePipelines({
  accessToken,
  pageSize,
  enabledQuery,
  visibility,
  filter,
  orderBy,
  view,
}: {
  pageSize: number;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  visibility: Nullable<Visibility>;
  filter: Nullable<string>;
  orderBy: Nullable<string>;
  view: Nullable<ResourceView>;
}): UseInfiniteQueryResult<
  InfiniteData<ListAccessiblePipelineResponse>,
  Error
> {
  return useInfiniteQuery({
    queryKey: queryKeyStore.pipeline.getUseInfiniteAccessiblePipelinesQueryKey({
      filter,
      visibility,
      view,
      orderBy,
    }),
    queryFn: async ({ pageParam }) => {
      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelines = await client.pipeline.pipeline.listAccessiblePipelines({
        enablePagination: true,
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? undefined,
        pageToken: pageParam ?? undefined,
        visibility: visibility ?? undefined,
        filter: filter ?? undefined,
        orderBy: orderBy ?? undefined,
        view: view ?? "VIEW_BASIC",
      });

      return Promise.resolve(pipelines);
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
