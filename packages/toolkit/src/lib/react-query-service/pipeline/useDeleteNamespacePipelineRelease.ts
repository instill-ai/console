"use client";

import type { PipelineRelease } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useDeleteNamespacePipelineRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespacePipelineReleaseName,
      accessToken,
    }: {
      namespacePipelineReleaseName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.vdp.release.deleteNamespacePipelineRelease({
        namespacePipelineReleaseName,
      });

      return Promise.resolve({ namespacePipelineReleaseName, accessToken });
    },
    onSuccess: async ({ namespacePipelineReleaseName }) => {
      // At this stage the pipelineName will be
      // users/<uid>/pipelines/<pid>/releases/<version>
      const pipelineReleaseNameArray = namespacePipelineReleaseName.split("/");
      const namespaceName = `${pipelineReleaseNameArray[0]}/${pipelineReleaseNameArray[1]}`;

      queryClient.setQueryData<PipelineRelease[]>(
        ["pipelineReleases", namespaceName],
        (old) =>
          old ? old.filter((e) => e.name !== namespacePipelineReleaseName) : [],
      );
      queryClient.removeQueries({
        queryKey: ["pipelineReleases", namespacePipelineReleaseName],
        exact: true,
      });

      // Process watch state
      queryClient.removeQueries({
        queryKey: ["pipelineReleases", namespacePipelineReleaseName, "watch"],
        exact: true,
      });
    },
  });
}
