"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";

export function usePipelineTriggerComputationTimeCharts({
  enabled,
  accessToken,
  filter,
  requesterId,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  requesterId?: string;
}) {
  return useQuery({
    queryKey: ["pipelineTriggerCharts", filter, requesterId],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const triggers =
        await client.mgmt.metric.listPipelineTriggerComputationTimeCharts({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          filter: filter ?? undefined,
        });

      return Promise.resolve(triggers);
    },
    enabled,
  });
}
