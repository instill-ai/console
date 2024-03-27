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
  listUserPipelinesQuery,
} from "../../vdp-sdk";

export function useInfiniteUserPipelines({
  userName,
  accessToken,
  pageSize,
  enabledQuery,
  filter,
  visibility,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  pageSize?: number;
  enabledQuery: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}): UseInfiniteQueryResult<InfiniteData<ListPipelinesResponse>, Error> {
  let enabled = false;

  if (userName && enabledQuery) {
    enabled = true;
  }

  const queryKey = ["pipelines", userName, "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const pipelines = await listUserPipelinesQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: pageParam ?? null,
        userName,
        accessToken,
        enablePagination: true,
        filter,
        visibility,
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
    enabled,
  });
}
