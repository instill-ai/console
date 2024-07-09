import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { env } from "../../../server";
import { Nullable } from "../../type";
import {
  getInstillAPIClient,
  ListPipelineReleasesResponse,
} from "../../vdp-sdk";

export function useInfiniteNamespacePipelineReleases({
  namespacePipelineName,
  enabledQuery,
  accessToken,
  pageSize,
  retry,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  pageSize?: number;
  retry?: false | number;
  shareCode?: string;
}): UseInfiniteQueryResult<InfiniteData<ListPipelineReleasesResponse>, Error> {
  let enabled = false;

  if (namespacePipelineName && enabledQuery) {
    enabled = true;
  }

  const queryKey = ["pipelineReleases", namespacePipelineName, "infinite"];

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
    retry: retry === false ? false : retry ? retry : 3,
  });
}
