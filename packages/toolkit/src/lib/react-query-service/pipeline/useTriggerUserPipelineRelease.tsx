import { useMutation } from "@tanstack/react-query";

import type { TriggerUserPipelinePayload } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { triggerUserPipelineReleaseAction } from "../../vdp-sdk";

export function useTriggerUserPipelineRelease() {
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
      const pipelineRelease = await triggerUserPipelineReleaseAction({
        pipelineReleaseName,
        payload,
        accessToken,
        returnTraces,
      });

      return Promise.resolve(pipelineRelease);
    },
  });
}
