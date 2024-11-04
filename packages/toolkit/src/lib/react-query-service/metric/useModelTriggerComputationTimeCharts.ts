"use client";

import { useQuery } from "@tanstack/react-query";
import { ModelTriggerChartRecord, Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useModelTriggerComputationTimeCharts({
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
  return useQuery<ModelTriggerChartRecord[]>({
    queryKey: ["modelTriggerCharts", filter, requesterId],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const response = await client.core.metric.listModelTriggersChart({
        pageSize: undefined,
        filter: filter ?? undefined,
      });

      const transformedData: ModelTriggerChartRecord[] = response.map(
        (record) => ({
          modelId: record.modelId,
          modelUid: record.modelUid,
          triggerMode: record.triggerMode,
          status: record.status,
          timeBuckets: record.timeBuckets || [],
          triggerCounts: record.triggerCounts || [],
          computeTimeDuration: record.computeTimeDuration || [],
          watchState: record.watchState,
        }),
      );

      return transformedData;
    },
    enabled,
  });
}
