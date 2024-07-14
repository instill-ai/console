"use client";

import type { TriggerNamespacePipelineRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useTriggerNamespacePipeline() {
  return useMutation({
    mutationFn: async (
      props: TriggerNamespacePipelineRequest & {
        accessToken: Nullable<string>;
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
  });
}
