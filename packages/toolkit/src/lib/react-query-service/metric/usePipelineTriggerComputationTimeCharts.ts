"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function usePipelineTriggerComputationTimeCharts({
  enabled,
  accessToken,
  filter,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  return useQuery({
    queryKey: ["charts", filter],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const triggers =
        await client.core.metric.listPipelineTriggerComputationTimeCharts({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          filter: filter ?? undefined,
        });

      return Promise.resolve(triggers);
    },
    enabled,
  });
}
