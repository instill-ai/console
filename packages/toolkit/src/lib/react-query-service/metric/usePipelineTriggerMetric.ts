"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";

export function usePipelineTriggerMetric({
  enabled,
  accessToken,
  filter,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  return useQuery({
    queryKey: ["tables", filter],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const triggerMetric = await client.core.metric.listPipelineTriggerMetric({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        filter: filter ?? undefined,
        enablePagination: false,
      });

      return Promise.resolve(triggerMetric);
    },
    enabled,
  });
}
