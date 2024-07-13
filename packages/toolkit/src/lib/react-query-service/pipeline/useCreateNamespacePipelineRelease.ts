"use client";

import type { CreateNamespacePipelineReleaseRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import type { PipelineRelease } from "../../vdp-sdk";
import { getInstillAPIClient } from "../../vdp-sdk";

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

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      const pipelineRelease =
        await client.vdp.release.createNamespacePipelineRelease(payload);

      return Promise.resolve({ pipelineRelease });
    },
    onSuccess: async ({ pipelineRelease }) => {
      // At this stage the pipelineName will be
      // users/<uid>/pipelines/<pid>/releases/<version>
      const pipelineNameArray = pipelineRelease.name.split("/");
      const entityName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.setQueryData<PipelineRelease>(
        ["pipelineReleases", pipelineRelease.name],
        pipelineRelease,
      );

      queryClient.setQueryData<PipelineRelease[]>(
        ["pipelineReleases", entityName],
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
