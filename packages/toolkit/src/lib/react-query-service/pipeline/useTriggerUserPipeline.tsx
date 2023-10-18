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
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

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
