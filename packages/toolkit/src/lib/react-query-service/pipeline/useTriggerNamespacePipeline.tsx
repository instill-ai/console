"use client";

import type { TriggerNamespacePipelineRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

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

      const response =
        await client.vdp.trigger.triggerNamespacePipeline(payload);

      return Promise.resolve(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-runs"] });
    },
  });
}
