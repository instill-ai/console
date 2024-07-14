"use client";

import type { Pipeline, RenameNamespacePipelineRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useRenameNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: RenameNamespacePipelineRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipeline =
        await client.vdp.pipeline.renameNamespacePipeline(payload);

      return Promise.resolve({
        pipeline,
        accessToken,
        oldPipelineName: payload.namespacePipelineName,
      });
    },
    onSuccess: async ({ pipeline, oldPipelineName }) => {
      // At this stage the pipelineName will be users/<uid>/pipelines/<pid>
      const pipelineNameArray = pipeline.name.split("/");
      const userName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.removeQueries({ queryKey: ["pipelines", oldPipelineName] });

      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline,
      );

      queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
        old
          ? [...old.filter((e) => e.name !== oldPipelineName), pipeline]
          : [pipeline],
      );
    },
  });
}
