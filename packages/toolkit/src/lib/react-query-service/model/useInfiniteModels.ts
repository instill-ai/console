import { useInfiniteQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { listModelsQuery, Visibility } from "../../vdp-sdk";

export function useInfiniteModels({
  accessToken,
  pageSize,
  enabledQuery,
  filter,
  visibility,
  orderBy,
  disabledViewFull,
}: {
  pageSize?: number;
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  orderBy: Nullable<string>;
  disabledViewFull?: boolean;
}) {
  const queryKey = ["models", "infinite"];

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
    queryKey,
    queryFn: async ({ pageParam }) => {
      const models = await listModelsQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE") ?? null,
        nextPageToken: pageParam ?? null,
        accessToken,
        filter,
        visibility,
        enablePagination: true,
        orderBy,
        disabledViewFull,
      });

      return Promise.resolve(models);
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
