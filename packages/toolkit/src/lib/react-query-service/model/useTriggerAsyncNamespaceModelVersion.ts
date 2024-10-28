"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../vdp-sdk";

export function useTriggerAsyncNamespaceModelVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      modelId,
      versionId,
      taskInputs,
      accessToken,
      requesterUid,
      returnTraces,
    }: {
      namespaceId: string;
      modelId: string;
      versionId: string;
      taskInputs: Record<string, unknown>[];
      accessToken: Nullable<string>;
      requesterUid?: string;
      returnTraces?: boolean;
    }) => {
      if (!accessToken) {
        throw new Error("Access token is required");
      }

      const client = getInstillModelAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.model.triggerAsyncNamespaceModelVersion({
        namespaceId,
        modelId,
        versionId,
        taskInputs,
        requesterUid,
        returnTraces,
        isConsole: true,
      });

      return Promise.resolve(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-runs"] });
      queryClient.invalidateQueries({ queryKey: ["models", "watch"] });
    },
  });
}
