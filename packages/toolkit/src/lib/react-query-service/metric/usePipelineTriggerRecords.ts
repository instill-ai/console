import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { listPipelineTriggerRecordsQuery } from "../../vdp-sdk/metric";
import { env } from "../../utility";

export function usePipelineTriggerRecords({
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
  return useQuery(
    ["metrics", "pipelines", "triggers", filter],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const triggers = await listPipelineTriggerRecordsQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
      });

      return Promise.resolve(triggers);
    },
    {
      enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
