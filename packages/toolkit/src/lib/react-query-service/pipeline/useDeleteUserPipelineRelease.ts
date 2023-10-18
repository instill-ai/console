import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PipelineRelease,
  deleteUserPipelineReleaseMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteUserPipelineRelease = () => {
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

      await deleteUserPipelineReleaseMutation({
        pipelineReleaseName,
        accessToken,
      });

      return Promise.resolve({ pipelineReleaseName, accessToken });
    },
    {
      onSuccess: async ({ pipelineReleaseName, accessToken }) => {
        // At this stage the pipelineName will be
        // users/<uid>/pipelines/<pid>/releases/<version>
        const pipelineReleaseNameArray = pipelineReleaseName.split("/");
        const userName = `${pipelineReleaseNameArray[0]}/${pipelineReleaseNameArray[1]}`;

        queryClient.setQueryData<PipelineRelease[]>(
          ["pipelineReleases", userName],
          (old) =>
            old ? old.filter((e) => e.name !== pipelineReleaseName) : []
        );
        queryClient.removeQueries(["pipelineReleases", pipelineReleaseName], {
          exact: true,
        });

        // Process watch state
        queryClient.removeQueries(
          ["pipelineReleases", pipelineReleaseName, "watch"],
          {
            exact: true,
          }
        );
      },
    }
  );
};
