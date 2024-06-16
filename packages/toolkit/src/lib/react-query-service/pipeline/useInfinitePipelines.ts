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
      const pipelines = await listPipelinesQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        nextPageToken: pageParam ?? null,
        accessToken,
        enablePagination: true,
        visibility,
        filter,
        orderBy,
        disabledViewFull,
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
