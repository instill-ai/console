"use client";

import type { TriggerNamespacePipelineReleaseRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";

export function useStreamingTriggerUserPipelineRelease() {
  return useMutation({
    mutationFn: async (
      props: Omit<TriggerNamespacePipelineReleaseRequest, "stream"> & {
        accessToken: Nullable<string>;
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
