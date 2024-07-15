import { useMutation } from "@tanstack/react-query";

import type { TriggerUserModelPayload } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { triggerUserModelActionAsync } from "../../vdp-sdk";

export function useTriggerUserModelAsync() {
  return useMutation({
    mutationFn: async ({
      modelName,
      payload,
      accessToken,
      requesterUid,
      returnTraces,
    }: {
      modelName: string;
      payload: TriggerUserModelPayload;
      accessToken: Nullable<string>;
      requesterUid?: string;
      returnTraces?: boolean;
    }) => {
      const response = await triggerUserModelActionAsync({
        modelName,
        payload,
        accessToken,
        requesterUid,
        returnTraces,
      });

      return Promise.resolve(response);
    },
  });
}
