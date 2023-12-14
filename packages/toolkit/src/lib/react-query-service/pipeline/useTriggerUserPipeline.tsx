import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerUserPipelineAction,
} from "../../vdp-sdk";

export const useTriggerUserPipeline = () => {
  return useMutation(
    async ({
      pipelineName,
      payload,
      accessToken,
      returnTraces,
    }: {
      pipelineName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
    }) => {
      const pipelineRelease = await triggerUserPipelineAction({
        pipelineName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    }
  );
};
