import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { Nullable } from "../../type";
import { listPipelineTriggerRecordsQuery } from "../../vdp-sdk/metric";

export function usePipelineTriggerRecords({
  enabled,
  accessToken,
  filter,
  previousFilter,
  retry,
  filterId,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  previousFilter: Nullable<string>;
  retry?: false | number;
  filterId: Nullable<string>;
}) {
  return useQuery({
    queryKey: ["metrics", "pipelines", "triggers", filterId],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const triggers = await listPipelineTriggerRecordsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
      });

      const previousTriggers = await listPipelineTriggerRecordsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter: previousFilter,
      });

      return Promise.resolve({ triggers, previousTriggers });
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
