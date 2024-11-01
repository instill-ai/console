"use client";

import { useQuery } from "@tanstack/react-query";
import { ListPipelineRunsByRequesterResponse, Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";

export function useListPipelineRunsByRequester({
  enabled,
  accessToken,
  pageSize,
  page,
  filter,
  requesterId,
  requesterUid,
  start,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  pageSize?: number;
  page: Nullable<number>;
  filter?: string;
  requesterUid?: string;
  requesterId?: string;
  start: string;
}) {
  return useQuery<ListPipelineRunsByRequesterResponse>({
    queryKey: ["pipelineRuns", pageSize, page, filter, requesterId, start],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const data = await client.core.metric.listPipelineRunsByRequester({
        pageSize,
        page,
        filter,
        requesterId,
        requesterUid,
        start,
        enablePagination: true,
      });
      // Need to fix the casting
      return data as ListPipelineRunsByRequesterResponse;
    },
    enabled: enabled,
  });
}
