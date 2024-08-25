"use client";

import type { TriggerNamespacePipelineRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useStreamingTriggerUserPipeline() {
  return useMutation({
    mutationFn: async (
      props: Omit<TriggerNamespacePipelineRequest, "stream"> & {
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
        stream: true,
      });

      return Promise.resolve(response);
    },
  });
}
