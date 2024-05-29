import { useInfiniteQuery } from "@tanstack/react-query";
import { env } from "../../../server";
import { Visibility, listModelsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useInfiniteModels({
  accessToken,
  pageSize,
  enabledQuery,
  retry,
  filter,
  visibility,
  order_by,
}: {
  pageSize?: number;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  retry?: false | number;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  order_by: Nullable<string>;
}) {
  const queryKey = ["models", "infinite"];

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
    queryKey,
    queryFn: async ({ pageParam }) => {
      const models = await listModelsQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        nextPageToken: pageParam ?? null,
        accessToken,
        filter,
        visibility,
        enablePagination: true,
        order_by,
      });

      return Promise.resolve(models);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage.next_page_token === "") {
        return null;
      }

      return lastPage.next_page_token;
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
