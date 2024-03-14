import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import {
  fetchUserPipelineReleases,
  getUseUserPipelineReleasesQueryKey,
} from "./server";

export function useUserPipelineReleases({
  pipelineName,
  enabled,
  accessToken,
  retry,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  retry?: false | number;
  shareCode?: string;
}) {
  let enableQuery = false;

  if (pipelineName && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseUserPipelineReleasesQueryKey(pipelineName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return fetchUserPipelineReleases({
        pipelineName,
        accessToken,
        shareCode,
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
