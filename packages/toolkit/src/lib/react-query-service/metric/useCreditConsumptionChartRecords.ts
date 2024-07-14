import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useCreditConsumptionChartRecords({
  enabled,
  accessToken,
  retry,
  start,
  stop,
  owner,
  aggregationWindow,
}: {
  enabled: boolean;
  owner: Nullable<string>;
  accessToken: Nullable<string>;
  start: Nullable<string>;
  stop: Nullable<string>;
  aggregationWindow: Nullable<string>;
  retry?: false | number;
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
      owner,
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

      if (!owner) {
        return Promise.reject(new Error("owner not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const data =
        await client.core.metric.listInstillCreditConsumptionTimeChart({
          owner,
          start: start ?? undefined,
          stop: stop ?? undefined,
          aggregationWindow: aggregationWindow ?? undefined,
        });

      return Promise.resolve(data);
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
