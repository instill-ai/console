"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import { fetchUserPipeline, getUseUserPipelineQueryKey } from "./server";

export function useUserPipeline({
  pipelineName,
  accessToken,
  enabled,
  retry,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  shareCode?: string;
}) {
  let enableQuery = false;

  if (pipelineName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseUserPipelineQueryKey(pipelineName),
    queryFn: async () => {
      return await fetchUserPipeline({
        pipelineName,
        accessToken,
        shareCode,
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
