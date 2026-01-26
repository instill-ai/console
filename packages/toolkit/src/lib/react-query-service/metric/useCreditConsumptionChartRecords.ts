"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useCreditConsumptionChartRecords({
  enabled,
  accessToken,
  start,
  stop,
  namespaceId,
  aggregationWindow,
}: {
  enabled: boolean;
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  start: Nullable<string>;
  stop: Nullable<string>;
  aggregationWindow: Nullable<string>;
}) {
  let enabledQuery = false;
  if (enabled && start && stop && aggregationWindow) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: [
      namespaceId,
      "modelTriggerCharts",
      "creditConsumption",
      start,
      stop,
      aggregationWindow,
    ],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const data =
        await client.mgmt.metric.listInstillCreditConsumptionTimeChart({
          namespaceId,
          start: start ?? undefined,
          stop: stop ?? undefined,
          aggregationWindow: aggregationWindow ?? undefined,
        });

      return Promise.resolve(data);
    },
    enabled: enabledQuery,
  });
}
