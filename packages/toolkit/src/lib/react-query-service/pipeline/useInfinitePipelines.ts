"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import type { ListPipelinesResponse } from "../../vdp-sdk";
import { env } from "../../../server";
import { Nullable } from "../../type";
import { getInstillAPIClient, Visibility } from "../../vdp-sdk";

export function useInfinitePipelines({
  accessToken,
  pageSize,
  enabledQuery,
  visibility,
  filter,
  orderBy,
  disabledViewFull,
}: {
  pageSize: number;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  visibility: Nullable<Visibility>;
  filter: Nullable<string>;
  orderBy: Nullable<string>;
  disabledViewFull?: boolean;
}): UseInfiniteQueryResult<InfiniteData<ListPipelinesResponse>, Error> {
  const queryKey = ["pipelines", "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  if (orderBy) {
    queryKey.push(orderBy);
  }

  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
        publicAccess: accessToken ? false : true,
      });

      const pipelines = await client.vdp.pipeline.listAccessiblePipelines({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        pageToken: pageParam ?? undefined,
        enablePagination: true,
        visibility: visibility ?? undefined,
        filter: filter ?? undefined,
        orderBy: orderBy ?? undefined,
        view: disabledViewFull ? undefined : "VIEW_FULL",
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
