import { QueryClient, env } from "../../../../server";
import { Nullable } from "../../../type";
import { ListUserPipelineReleasesQuery } from "../../../vdp-sdk";

export async function fetchUserPipelineReleases({
  pipelineName,
  accessToken,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  if (!pipelineName) {
    return Promise.reject(new Error("pipelineName not provided"));
  }

  const pipelineReleases = await ListUserPipelineReleasesQuery({
    pipelineName,
    pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
    nextPageToken: null,
    accessToken,
    shareCode: shareCode,
  });

  return Promise.resolve(pipelineReleases);
}

export function getUseUserPipelineReleasesQueryKey(
  pipelineName: Nullable<string>
) {
  return ["pipelineReleases", pipelineName];
}

export function prefetchUserPipelineReleases({
  pipelineName,
  accessToken,
  queryClient,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  shareCode?: string;
}) {
  const queryKey = getUseUserPipelineReleasesQueryKey(pipelineName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserPipelineReleases({
        pipelineName,
        accessToken,
        shareCode,
      });
    },
  });
}
