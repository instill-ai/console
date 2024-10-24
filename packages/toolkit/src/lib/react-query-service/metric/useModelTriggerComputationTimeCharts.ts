import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { Nullable } from "../../type";
import { getInstillAPIClient, ModelTriggerChartRecord } from "../../vdp-sdk";

export function useModelTriggerComputationTimeCharts({
  enabled,
  accessToken,
  filter,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  return useQuery<ModelTriggerChartRecord[]>({
    queryKey: ["modelCharts", filter],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }

      const client = getInstillAPIClient({ accessToken });
      const response = await client.core.metric.listModelTriggersChart({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        filter: filter ?? undefined
      });

      return response.modelTriggerChartRecords;
    },
    enabled,
  });
}


