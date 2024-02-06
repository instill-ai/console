import { useQuery } from "@tanstack/react-query";
import { getUserPipelineReleaseQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useUserPipelineRelease({
  pipelineReleaseName,
  enabled,
  accessToken,
  retry,
}: {
  pipelineReleaseName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (pipelineReleaseName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["pipelineReleases", pipelineReleaseName],
    async () => {
      if (!pipelineReleaseName) {
        return Promise.reject(new Error("pipelineReleaseName not provided"));
      }

      const pipelineRelease = await getUserPipelineReleaseQuery({
        pipelineReleaseName,
        accessToken,
      });

      return Promise.resolve(pipelineRelease);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
