import { useQuery } from "@tanstack/react-query";
import {
  PipelineReleasesWatchState,
  watchUserPipelineReleaseQuery,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useWatchUserPipelineReleases({
  pipelineReleaseNames,
  accessToken,
  enabled,
  retry,
}: {
  pipelineReleaseNames: Nullable<string[]>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) {
  let enableQuery = false;

  if (pipelineReleaseNames && enabled && pipelineReleaseNames.length > 0) {
    enableQuery = true;
  }

  return useQuery(
    ["pipelineReleases", , "watch"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!pipelineReleaseNames || pipelineReleaseNames.length === 0) {
        return Promise.reject(new Error("pipelineReleaseNames not provided"));
      }

      let watches: PipelineReleasesWatchState = {};

      for (const pipelineReleaseName of pipelineReleaseNames) {
        const watch = await watchUserPipelineReleaseQuery({
          pipelineReleaseName,
          accessToken,
        });
        watches[pipelineReleaseName] = watch;
      }

      return Promise.resolve(watches);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
