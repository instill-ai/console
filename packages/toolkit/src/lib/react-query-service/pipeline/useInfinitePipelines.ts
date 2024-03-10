import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Nullable } from "../../type";
import { env } from "../../utility";
import {
  ListPipelinesResponse,
  Visibility,
  listPipelinesQuery,
} from "../../vdp-sdk";

export function useInfinitePipelines({
  accessToken,
  pageSize,
  enabledQuery,
  visibility,
  filter,
}: {
  pageSize: number;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  visibility: Nullable<Visibility>;
  filter: Nullable<string>;
}): UseInfiniteQueryResult<InfiniteData<ListPipelinesResponse>, Error> {
  return useInfiniteQuery({
    queryKey: filter
      ? ["pipelines", "infinite", filter]
      : ["pipelines", "infinite"],
    queryFn: async ({ pageParam }) => {
      const pipelines = await listPipelinesQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        nextPageToken: pageParam ?? null,
        accessToken,
        enablePagination: true,
        visibility,
        filter,
      });

      return Promise.resolve(pipelines);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage.next_page_token === "") {
        return null;
      }

      return lastPage.next_page_token;
    },
    enabled: enabledQuery,
  });
}
