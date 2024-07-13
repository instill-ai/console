import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function usePipelineTriggerComputationTimeCharts({
  enabled,
  accessToken,
  filter,
  retry,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["charts", filter],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      const triggers =
        await client.core.metric.listPipelineTriggerComputationTimeCharts({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          filter: filter ?? undefined,
        });

      return Promise.resolve(triggers);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
