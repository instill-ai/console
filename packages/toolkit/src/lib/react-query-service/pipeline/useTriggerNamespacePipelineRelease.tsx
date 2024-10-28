"use client";

import type { TriggerNamespacePipelineReleaseRequest } from "instill-sdk";
import { useMutation } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { Nullable } from "../../type";

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
