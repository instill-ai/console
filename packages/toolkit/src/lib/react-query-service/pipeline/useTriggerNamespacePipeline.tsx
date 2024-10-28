"use client";

import type { TriggerNamespacePipelineRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";

export function useTriggerNamespacePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      props: Omit<TriggerNamespacePipelineRequest, "streaming"> & {
        accessToken: Nullable<string>;
        triggerNamespaceName?: string;
      },
    ) => {
      const { accessToken, ...payload } = props;

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.vdp.trigger.triggerNamespacePipeline({
        ...payload,
        isConsole: true,
      });

      return Promise.resolve(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
    },
  });
}
