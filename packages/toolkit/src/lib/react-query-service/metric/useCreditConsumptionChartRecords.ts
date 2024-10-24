import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

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

  const startDate = start
    ? new Date(start).toLocaleString("en-us", {
      hour: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    : null;

  const stopDate = stop
    ? new Date(stop).toLocaleString("en-us", {
      hour: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    : null;

  return useQuery({
    queryKey: [
      namespaceId,
      "charts",
      "creditConsumption",
      startDate,
      stopDate,
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
        await client.core.metric.listInstillCreditConsumptionTimeChart({
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
