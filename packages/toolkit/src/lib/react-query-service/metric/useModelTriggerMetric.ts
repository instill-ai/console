"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ModelTriggerTableRecord,
} from "instill-sdk";
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
  return useQuery<ModelTriggerTableRecord[]>({
    queryKey: ["modelTriggerMetrics", filter, requesterId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillAPIClient({ accessToken });
      const response = (await client.core.metric.listModelTriggerMetric({
        pageSize: undefined,
        filter: filter ?? undefined,
        requesterId,
        enablePagination: false,
      }));

      if (Array.isArray(response)) {
        return response;
      }

      return response.modelTriggerTableRecords || [];
    },
    enabled,
  });
}
