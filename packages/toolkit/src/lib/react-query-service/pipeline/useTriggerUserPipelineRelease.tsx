import { useMutation } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  type TriggerUserPipelinePayload,
  triggerUserPipelineReleaseAction,
} from "../../vdp-sdk";

export function useTriggerUserPipelineRelease() {
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
      const pipelineRelease = await triggerUserPipelineReleaseAction({
        pipelineReleaseName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    }
  );
}
