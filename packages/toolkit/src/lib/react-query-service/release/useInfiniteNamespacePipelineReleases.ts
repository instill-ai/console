import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  ListNamespacePipelineReleaseResponse,
  ResourceView,
} from "instill-sdk";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";
import { queryKeyStore } from "../queryKeyStore";

export function getUseInfiniteNamespacePipelineReleasesQueryKey({
  namespaceId,
  pipelineId,
  view,
  shareCode,
}: {
  namespaceId: string;
  pipelineId: string;
  view: Nullable<ResourceView>;
  shareCode: Nullable<string>;
}) {
  const queryKey = [
    namespaceId,
    "pipelines",
    pipelineId,
    "releases",
    "infinite",
  ];

  if (view) {
    queryKey.push(view);
  }

  if (shareCode) {
    queryKey.push(shareCode);
  }

  return queryKey;
}

export function useInfiniteNamespacePipelineReleases({
  namespaceId,
  pipelineId,
  enabledQuery,
  accessToken,
  pageSize,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  pageSize: Nullable<number>;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}): UseInfiniteQueryResult<
  InfiniteData<ListNamespacePipelineReleaseResponse>,
  Error
> {
  let enabled = false;

  if (namespaceId && pipelineId && enabledQuery) {
    enabled = true;
  }

  return useInfiniteQuery({
    queryKey:
      queryKeyStore.release.getUseInfiniteNamespacePipelineReleasesQueryKey({
        namespaceId,
        pipelineId,
        view,
        shareCode,
      }),
    queryFn: async ({ pageParam }) => {
      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      if (!pipelineId) {
        return Promise.reject(new Error("pipelineId is required"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelines = await client.vdp.release.listNamespacePipelineReleases({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        pageToken: pageParam ?? undefined,
        namespaceId,
        pipelineId,
        enablePagination: true,
        shareCode: shareCode ?? undefined,
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
