"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable } from "vitest";

import { getInstillAPIClient } from "../../sdk-helper";

export function useModelTriggerMetric({
  enabled,
  accessToken,
  filter,
  requesterId,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  requesterId: Nullable<string>;
}) {
  return useQuery({
    queryKey: ["modelTriggerMetrics", filter, requesterId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillAPIClient({ accessToken });

      try {
        const response = await client.mgmt.metric.listModelTriggerMetric({
          pageSize: undefined,
          filter: filter ?? undefined,
          requesterId: requesterId ?? undefined,
          enablePagination: false,
        });

        return response.modelTriggerChartRecords || [];
      } catch (error) {
        throw new Error(`Failed to fetch model trigger metrics: ${error}`);
      }
    },
    enabled,
  });
}
