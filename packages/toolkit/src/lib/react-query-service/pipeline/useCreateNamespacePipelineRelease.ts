"use client";

import type {
  CreateNamespacePipelineReleaseRequest,
  PipelineRelease,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { getUseNamespacePipelineReleasesQueryKey } from "./use-namespace-pipeline-releases/server";
import { getUseInfiniteNamespacePipelineReleasesQueryKey } from "./useInfiniteNamespacePipelineReleases";

export function useCreateNamespacePipelineRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespacePipelineReleaseRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipelineRelease =
        await client.vdp.release.createNamespacePipelineRelease(payload);

      return Promise.resolve({ pipelineRelease });
    },
    onSuccess: async ({ pipelineRelease }) => {
      // At this stage the pipelineName will be
      // users/<uid>/pipelines/<pid>/releases/<version>
      const pipelineNameArray = pipelineRelease.name.split("/");
      const namespaceName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;
      const pipelineName = `${namespaceName}/pipelines/${pipelineNameArray[3]}`;

      const useInfiniteNamespacePipelineReleasesQueryKey =
        getUseInfiniteNamespacePipelineReleasesQueryKey(pipelineName);

      queryClient.invalidateQueries({
        queryKey: useInfiniteNamespacePipelineReleasesQueryKey,
      });

      const useNamespacePipelineReleasesQueryKey =
        getUseNamespacePipelineReleasesQueryKey(pipelineName);

      queryClient.setQueryData<PipelineRelease[]>(
        useNamespacePipelineReleasesQueryKey,
        (old) =>
          old
            ? [
                ...old.filter((e) => e.name !== pipelineRelease.name),
                pipelineRelease,
              ]
            : [pipelineRelease],
      );
    },
  });
}
