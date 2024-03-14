import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerUserPipelineAction,
} from "../../vdp-sdk";

export function useTriggerUserPipeline() {
  return useMutation({
    mutationFn: async ({
      pipelineName,
      payload,
      accessToken,
      returnTraces,
      shareCode,
    }: {
      pipelineName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
      shareCode?: string;
    }) => {
      const response = await triggerUserPipelineAction({
        pipelineName,
        payload,
        accessToken,
        returnTraces,
        shareCode,
      });

      return Promise.resolve(response);
    },
  });
}
