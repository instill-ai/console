import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  TriggerAsyncUserPipelinePayload,
  triggerAsyncUserPipelineAction,
} from "../../vdp-sdk";

export function useTriggerAsyncUserPipeline() {
  return useMutation({
    mutationFn: async ({
      pipelineName,
      payload,
      accessToken,
      returnTraces,
    }: {
      pipelineName: string;
      payload: TriggerAsyncUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipelineRelease = await triggerAsyncUserPipelineAction({
        pipelineName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    },
  });
}
