"use client";

import type { Pipeline, UpdateNamespacePipelineRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../sdk-helper";

export function useUpdateNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      props: UpdateNamespacePipelineRequest & {
        accessToken: Nullable<string>;
      },
    ) => {
      const { accessToken, ...payload } = props;

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipeline =
        await client.vdp.pipeline.updateNamespacePipeline(payload);

      return Promise.resolve({ pipeline });
    },
    onSuccess: async ({ pipeline }) => {
      // At this stage the pipelineName will be users/<uid>/pipelines/<pid>
      const pipelineNameArray = pipeline.name.split("/");
      const userName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline,
      );

      queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
        old
          ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
          : [pipeline],
      );

      queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
        old
          ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
          : [pipeline],
      );
    },
  });
}
