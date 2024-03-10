import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerAsyncUserPipelineReleaseAction,
} from "../../vdp-sdk";

export function useTriggerAsyncUserPipelineRelease() {
  return useMutation({
    mutationFn: async ({
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

      const pipelineRelease = await triggerAsyncUserPipelineReleaseAction({
        pipelineReleaseName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    },
  });
}
