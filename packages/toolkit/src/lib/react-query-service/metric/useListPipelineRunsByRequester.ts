import { useQuery } from "@tanstack/react-query";
import { ListPipelineRunsByRequesterResponse, Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useListPipelineRunsByRequester({
  enabled,
  accessToken,
  pageSize,
  page,
  orderBy,
  requesterId,
  start,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  pageSize?: number;
  page: Nullable<number>;
  orderBy?: string;
  requesterId?: string;
  start: string;
}) {
  return useQuery<ListPipelineRunsByRequesterResponse>({
    queryKey: ["pipelineRuns", requesterId, pageSize, page, orderBy, start],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const data = await client.mgmt.metric.listPipelineRunsByRequester({
        pageSize,
        page,
        orderBy,
        requesterId,
        start,
        enablePagination: true,
      });
      return data;
    },
    enabled: enabled,
  });
}
