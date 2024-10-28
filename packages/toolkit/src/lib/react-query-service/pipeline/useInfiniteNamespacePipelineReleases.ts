import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ListNamespacePipelineReleaseResponse } from "instill-sdk";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";

export function getUseInfiniteNamespacePipelineReleasesQueryKey(
  namespacePipelineName: Nullable<string>,
) {
  return ["pipelineReleases", namespacePipelineName, "infinite"];
}

export function useInfiniteNamespacePipelineReleases({
  namespacePipelineName,
  enabledQuery,
  accessToken,
  pageSize,
  shareCode,
  disabledViewFull,
}: {
  namespacePipelineName: Nullable<string>;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  pageSize?: number;
  shareCode?: string;
  disabledViewFull?: boolean;
}): UseInfiniteQueryResult<
  InfiniteData<ListNamespacePipelineReleaseResponse>,
  Error
> {
  let enabled = false;

  if (namespacePipelineName && enabledQuery) {
    enabled = true;
  }

  const queryKey = getUseInfiniteNamespacePipelineReleasesQueryKey(
    namespacePipelineName,
  );

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!namespacePipelineName) {
        return Promise.reject(new Error("namespacePipelineName not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelines = await client.vdp.release.listNamespacePipelineReleases({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        pageToken: pageParam ?? undefined,
        namespacePipelineName,
        enablePagination: true,
        shareCode,
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
