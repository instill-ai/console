import { useInfiniteQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { env } from "../../utility";
import { listUserPipelinesQuery } from "../../vdp-sdk";

export function useInfiniteUserPipelines({
  userName,
  accessToken,
  pageSize,
  enabledQuery,
}: {
  userName: string;
  accessToken: Nullable<string>;
  pageSize?: number;
  enabledQuery: boolean;
}) {
  let enabled = false;

  if (userName && enabledQuery) {
    enabled = true;
  }

  return useInfiniteQuery(
    ["pipelines", userName, "infinite"],
    async ({ pageParam }) => {
      const pipelines = await listUserPipelinesQuery({
        pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: pageParam ?? null,
        userName,
        accessToken,
        enablePagination: true,
      });

      return Promise.resolve(pipelines);
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next_page_token === "") {
          return null;
        }

        return lastPage.next_page_token;
      },
      enabled,
    }
  );
}
