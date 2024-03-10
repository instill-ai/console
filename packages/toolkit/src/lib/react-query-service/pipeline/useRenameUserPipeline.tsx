import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  renameUserPipelineMutation,
  type Pipeline,
  type RenameUserPipelinePayload,
} from "../../vdp-sdk";

export function useRenameUserPipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: RenameUserPipelinePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipeline = await renameUserPipelineMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({
        pipeline,
        accessToken,
        oldPipelineName: payload.name,
      });
    },
    onSuccess: async ({ pipeline, oldPipelineName }) => {
      // At this stage the pipelineName will be users/<uid>/pipelines/<pid>
      const pipelineNameArray = pipeline.name.split("/");
      const userName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.removeQueries({ queryKey: ["pipelines", oldPipelineName] });

      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline
      );

      queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
        old
          ? [...old.filter((e) => e.name !== oldPipelineName), pipeline]
          : [pipeline]
      );
    },
  });
}
