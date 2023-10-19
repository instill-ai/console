import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeObjKey } from "../../utility";
import {
  type PipelineRelease,
  type PipelineReleaseWatchState,
  type PipelineReleasesWatchState,
  watchUserPipelineReleaseQuery,
  restoreUserPipelineReleaseMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useRestoreUserPipelineRelease = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      pipelineReleaseName,
      accessToken,
    }: {
      pipelineReleaseName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipelineRelease = await restoreUserPipelineReleaseMutation({
        pipelineReleaseName,
        accessToken,
      });

      return Promise.resolve({ pipelineRelease, accessToken });
    },
    {
      onSuccess: async ({ pipelineRelease, accessToken }) => {
        // At this stage the pipelineName will be
        // users/<uid>/pipelines/<pid>/releases/<version>
        const pipelineReleaseNameArray = pipelineRelease.name.split("/");
        const userName = `${pipelineReleaseNameArray[0]}/${pipelineReleaseNameArray[1]}`;

        queryClient.setQueryData<PipelineRelease>(
          ["pipelineReleases", pipelineRelease.name],
          pipelineRelease
        );

        queryClient.setQueryData<PipelineRelease[]>(
          ["pipelineReleases", userName],
          (old) =>
            old
              ? [
                  ...old.filter((e) => e.name !== pipelineRelease.name),
                  pipelineRelease,
                ]
              : [pipelineRelease]
        );

        // process watch state

        const watch = await watchUserPipelineReleaseQuery({
          pipelineReleaseName: pipelineRelease.name,
          accessToken,
        });

        queryClient.setQueryData<PipelineReleaseWatchState>(
          ["pipelineReleases", pipelineRelease.name, "watch"],
          watch
        );

        queryClient.setQueryData<PipelineReleasesWatchState>(
          ["pipelineReleases", userName, "watch"],
          (old) =>
            old
              ? {
                  ...removeObjKey(old, pipelineRelease.name),
                  [pipelineRelease.name]: watch,
                }
              : { [pipelineRelease.name]: watch }
        );
      },
    }
  );
};
