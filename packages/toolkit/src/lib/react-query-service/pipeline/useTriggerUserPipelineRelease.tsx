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
      shareCode,
      requesterUid,
    }: {
      pipelineReleaseName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
      shareCode?: string;
      requesterUid?: string;
    }) => {
      const pipelineRelease = await triggerUserPipelineReleaseAction({
        pipelineReleaseName,
        payload,
        accessToken,
        returnTraces,
        shareCode,
        requesterUid,
      });

      return Promise.resolve(pipelineRelease);
    },
  });
}
