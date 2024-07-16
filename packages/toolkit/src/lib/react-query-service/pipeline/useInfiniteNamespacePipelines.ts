"use client";

import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ListNamespacePipelinesResponse } from "instill-sdk";

import { env } from "../../../server";
import { Nullable } from "../../type";
import { getInstillAPIClient, Visibility } from "../../vdp-sdk";

export function useInfiniteNamespacePipelines({
  namespaceName,
  accessToken,
  pageSize,
  enabledQuery,
  filter,
  visibility,
  disabledViewFull,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize?: number;
  enabledQuery: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  disabledViewFull?: boolean;
}): UseInfiniteQueryResult<
  InfiniteData<ListNamespacePipelinesResponse>,
  Error
> {
  let enabled = false;

  if (namespaceName && enabledQuery) {
    enabled = true;
  }

  const queryKey = ["pipelines", namespaceName, "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!namespaceName) {
        return Promise.reject(new Error("namespaceName not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelines = await client.vdp.pipeline.listNamespacePipelines({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        pageToken: pageParam ?? undefined,
        namespaceName,
        enablePagination: true,
        filter: filter ?? undefined,
        visibility: visibility ?? undefined,
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
    enabled,
  });
}
