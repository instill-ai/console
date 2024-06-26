import { useMutation } from "@tanstack/react-query";

import type { TriggerUserPipelinePayload } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { triggerUserPipelineAction } from "../../vdp-sdk";

export function useTriggerUserPipeline() {
  return useMutation({
    mutationFn: async ({
      pipelineName,
      payload,
      accessToken,
      returnTraces,
      shareCode,
      requesterUid,
    }: {
      pipelineName: string;
      payload: TriggerUserPipelinePayload;
      accessToken: Nullable<string>;
      returnTraces?: boolean;
      shareCode?: string;
      requesterUid?: string;
    }) => {
      const response = await triggerUserPipelineAction({
        pipelineName,
        payload,
        accessToken,
        returnTraces,
        shareCode,
        requesterUid,
      });

      return Promise.resolve(response);
    },
  });
}
