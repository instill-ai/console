import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import {
  fetchNamespacePipelineReleases,
  getUseNamespacePipelineReleasesQueryKey,
} from "./server";

export function useNamespacePipelineReleases({
  namespacePipelineName,
  enabled,
  accessToken,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  let enableQuery = false;

  if (namespacePipelineName && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseNamespacePipelineReleasesQueryKey(
    namespacePipelineName,
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchNamespacePipelineReleases({
          namespacePipelineName,
          accessToken,
          shareCode,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enableQuery,
  });
}
