import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Nullable } from "../../type";
import { env } from "../../../server";
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
  order_by,
}: {
  pageSize: number;
  enabledQuery: boolean;
  accessToken: Nullable<string>;
  visibility: Nullable<Visibility>;
  filter: Nullable<string>;
  order_by: Nullable<string>;
}): UseInfiniteQueryResult<InfiniteData<ListPipelinesResponse>, Error> {
  const queryKey = ["pipelines", "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  if (order_by) {
    queryKey.push(order_by);
  }

  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam }) => {
      const pipelines = await listPipelinesQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        nextPageToken: pageParam ?? null,
        accessToken,
        enablePagination: true,
        visibility,
        filter,
        order_by,
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
