"use client";

import type { TriggerNamespacePipelineReleaseRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useStreamingTriggerUserPipelineRelease() {
  return useMutation({
    mutationFn: async (
      props: Omit<TriggerNamespacePipelineReleaseRequest, "stream"> & {
        accessToken: Nullable<string>;
        triggerNamespaceName?: string;
      },
    ) => {
      const { accessToken, ...payload } = props;

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const response = await client.vdp.trigger.triggerNamespacePipelineRelease(
        {
          ...payload,
          stream: true,
          isConsole: true,
        },
      );

      return Promise.resolve(response);
    },
  });
}
