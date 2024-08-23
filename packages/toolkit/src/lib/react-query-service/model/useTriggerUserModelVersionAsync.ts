import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TriggerUserModelPayload } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { triggerUserModelVersionActionAsync } from "../../vdp-sdk";

export function useTriggerUserModelVersionAsync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modelName,
      payload,
      accessToken,
      requesterUid,
      returnTraces,
      versionId,
    }: {
      modelName: string;
      payload: TriggerUserModelPayload;
      accessToken: Nullable<string>;
      requesterUid?: string;
      returnTraces?: boolean;
      versionId: Nullable<string>;
    }) => {
      const response = await triggerUserModelVersionActionAsync({
        modelName,
        payload,
        accessToken,
        requesterUid,
        returnTraces,
        versionId,
      });

      return Promise.resolve(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-runs"] });
    },
  });
}
