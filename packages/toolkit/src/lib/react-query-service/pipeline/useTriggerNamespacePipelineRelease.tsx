"use client";

import type { TriggerNamespacePipelineReleaseRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useTriggerNamespacePipelineRelease() {
  return useMutation({
    mutationFn: async (
      props: TriggerNamespacePipelineReleaseRequest & {
        accessToken: Nullable<string>;
      },
    ) => {
      const { accessToken, ...payload } = props;

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const pipelineRelease =
        await client.vdp.trigger.triggerNamespacePipelineRelease({
          ...payload,
          isConsole: true,
        });

      return Promise.resolve(pipelineRelease);
    },
  });
}
