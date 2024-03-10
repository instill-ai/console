import { useQuery } from "@tanstack/react-query";
import { watchUserPipelineReleaseQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useWatchUserPipelineRelease({
  pipelineReleaseName,
  accessToken,
  enabled,
  retry,
}: {
  pipelineReleaseName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) {
  let enableQuery = false;

  if (pipelineReleaseName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["pipelineReleases", pipelineReleaseName, "watch"],
    queryFn: async () => {
      if (!pipelineReleaseName) {
        return Promise.reject(new Error("pipelineReleaseName not provided"));
      }

      const watch = await watchUserPipelineReleaseQuery({
        pipelineReleaseName,
        accessToken,
      });

      return Promise.resolve(watch);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
