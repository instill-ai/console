import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TriggerUserModelPayload } from "../../vdp-sdk";
import { Nullable } from "../../type";
import { getInstillModelAPIClient } from "../../vdp-sdk";

export function useTriggerUserModelVersionAsync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modelId,
      userId,
      payload,
      accessToken,
      requesterUid,
      returnTraces,
      versionId,
    }: {
      modelId: string;
      userId: string;
      payload: TriggerUserModelPayload;
      accessToken: Nullable<string>;
      requesterUid?: string;
      returnTraces?: boolean;
      versionId: Nullable<string>;
    }) => {
      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.model.triggerAsyncNamespaceModelVersion({
        namespaceModelVersionName: `namespaces/${userId}/models/${modelId}/versions/${versionId}`,
        taskInputs: payload.taskInputs,
        requesterUid,
        returnTraces,
        isConsole: true,
      });

      return Promise.resolve(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-runs"] });
    },
  });
}
