import { useInfiniteQuery } from "@tanstack/react-query";
import { env } from "../../../server";
import { Visibility, listUserModelsQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useInfiniteUserModels({
  userName,
  accessToken,
  enabled,
  retry,
  filter,
  visibility,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  const queryKey = ["models", userName, "infinite"];

  if (filter) {
    queryKey.push(filter);
  }

  if (visibility) {
    queryKey.push(visibility);
  }

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userName) {
        return Promise.reject(new Error("userName not provided"));
      }

      const models = await listUserModelsQuery({
        userName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: pageParam ?? null,
        accessToken,
        filter,
        visibility,
        enablePagination: true,
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
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
