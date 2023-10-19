import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerUserPipelineReleaseAction,
} from "../../vdp-sdk";

export const useTriggerUserPipelineRelease = () => {
  return useMutation(
    async ({
      pipelineReleaseName,
      payload,
      accessToken,
      returnTraces,
    }: {
      pipelineReleaseName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipelineRelease = await triggerUserPipelineReleaseAction({
        pipelineReleaseName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    }
  );
};
