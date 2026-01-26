"use client";

import type {
  ListNamespacePipelinesResponse,
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

export function useInfiniteNamespacePipelines({
  namespaceId,
  accessToken,
  pageSize,
  enabledQuery,
  filter,
  visibility,
  view,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize: Nullable<number>;
  enabledQuery: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  view: Nullable<ResourceView>;
}): UseInfiniteQueryResult<
  InfiniteData<ListNamespacePipelinesResponse>,
  Error
> {
  let enabled = false;

  if (namespaceId && enabledQuery) {
    enabled = true;
  }

  return useInfiniteQuery({
    queryKey: queryKeyStore.pipeline.getUseInfiniteNamespacePipelinesQueryKey({
      namespaceId,
      filter,
      visibility,
      view,
    }),
    queryFn: async ({ pageParam }) => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelines = await client.pipeline.pipeline.listNamespacePipelines({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        pageToken: pageParam ?? undefined,
        namespaceId,
        enablePagination: true,
        filter: filter ?? undefined,
        visibility: visibility ?? undefined,
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
    enabled,
  });
}
