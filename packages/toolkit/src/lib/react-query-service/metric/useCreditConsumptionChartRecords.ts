import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { ListCreditConsumptionChartRecord } from "../../vdp-sdk";

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

  return useQuery({
    queryKey: ["charts", "creditConsumption", start, stop, aggregationWindow],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const data = await ListCreditConsumptionChartRecord({
        owner,
        start,
        stop,
        aggregationWindow,
        accessToken,
      });

      return Promise.resolve(data);
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}