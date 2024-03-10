import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { listTriggeredPipelineChartQuery } from "../../vdp-sdk";
import { env } from "../../utility";

export function useTriggeredPipelinesChart({
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

      const triggers = await listTriggeredPipelineChartQuery({
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        filter,
      });

      return Promise.resolve(triggers);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
