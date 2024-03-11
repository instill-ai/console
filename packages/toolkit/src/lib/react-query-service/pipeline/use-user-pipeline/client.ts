"use client";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import { fetchUserPipeline, getUseUserPipelineQueryKey } from "./server";

export function useUserPipeline({
  pipelineName,
  accessToken,
  enabled,
  retry,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  const router = useRouter();
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
        shareCode: router.query.shareCode?.toString(),
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
