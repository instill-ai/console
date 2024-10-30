"use client";

import type { TriggerNamespacePipelineRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";

export function useStreamingTriggerUserPipeline() {
  return useMutation({
    mutationFn: async (
      props: Omit<TriggerNamespacePipelineRequest, "stream"> & {
        accessToken: Nullable<string>;
      },
    ) => {
      const { accessToken, ...payload } = props;

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.vdp.trigger.triggerNamespacePipeline({
        ...payload,
        stream: true,
        isConsole: true,
      });

      return Promise.resolve(response);
    },
  });
}
