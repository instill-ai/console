import { QueryClient, env } from "../../../../server";
import { Nullable } from "../../../type";
import { Visibility, listUserPipelinesQuery } from "../../../vdp-sdk";

export async function fetchUserPipelines({
  userName,
  accessToken,
  filter,
  visibility,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  if (!userName) {
    return Promise.reject(new Error("userName not provided"));
  }

  const pipelines = await listUserPipelinesQuery({
    userName,
    pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    nextPageToken: null,
    accessToken,
    enablePagination: false,
    filter,
    visibility,
  });

  return Promise.resolve(pipelines);
}

export function getUseUserPipelinesQueryKey(userName: Nullable<string>) {
  return ["pipelines", userName];
}

export function prefetchUserPipelines({
  userName,
  accessToken,
  filter,
  visibility,
  queryClient,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
}) {
  const queryKey = getUseUserPipelinesQueryKey(userName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserPipelines({
        userName,
        accessToken,
        filter,
        visibility,
      });
    },
  });
}
