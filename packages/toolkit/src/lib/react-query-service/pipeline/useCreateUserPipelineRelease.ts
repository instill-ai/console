import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserPipelineReleaseMutation,
  type PipelineRelease,
  type CreateUserPipelineReleasePayload,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useCreateUserPipelineRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pipelineName,
      payload,
      accessToken,
    }: {
      pipelineName: string;
      payload: CreateUserPipelineReleasePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipelineRelease = await createUserPipelineReleaseMutation({
        pipelineName,
        payload,
        accessToken,
      });

      return Promise.resolve({ pipelineRelease, accessToken });
    },
    onSuccess: async ({ pipelineRelease, accessToken }) => {
      // At this stage the pipelineName will be
      // users/<uid>/pipelines/<pid>/releases/<version>
      const pipelineNameArray = pipelineRelease.name.split("/");
      const entityName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.setQueryData<PipelineRelease>(
        ["pipelineReleases", pipelineRelease.name],
        pipelineRelease
      );

      queryClient.setQueryData<PipelineRelease[]>(
        ["pipelineReleases", entityName],
        (old) =>
          old
            ? [
                ...old.filter((e) => e.name !== pipelineRelease.name),
                pipelineRelease,
              ]
            : [pipelineRelease]
      );
    },
  });
}
