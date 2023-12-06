import { useInfiniteQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { env } from "../../utility";
import { listUserPipelinesQuery } from "../../vdp-sdk";

export function useInfiniteUserPipelines({
  userName,
  accessToken,
  pageSize,
}: {
  userName: string;
  accessToken: Nullable<string>;
  pageSize?: number;
}) {
  const fetchUserPipelines = async (nextPageToken: Nullable<string>) => {
    const pipelines = await listUserPipelinesQuery({
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      nextPageToken,
      userName,
      accessToken,
      enablePagination: true,
    });

    return Promise.resolve(pipelines);
  };

  return useInfiniteQuery(
    ["pipelines", userName, "infinite"],
    async ({ pageParam }) => {
      const pipelines = await fetchUserPipelines(pageParam);
      return Promise.resolve(pipelines);
    },
    {
      getNextPageParam: (lastPage) => lastPage.next_page_token,
    }
  );
}
