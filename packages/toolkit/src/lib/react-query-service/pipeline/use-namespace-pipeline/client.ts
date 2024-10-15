"use client";

import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../../type";
import {
  fetchNamespacePipeline,
  getUseNamespacePipelineQueryKey,
} from "./server";

export function useNamespacePipeline({
  namespacePipelineName,
  accessToken,
  enabled,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  shareCode?: string;
}) {
  let enableQuery = false;

  if (namespacePipelineName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseNamespacePipelineQueryKey(namespacePipelineName),
    queryFn: async () => {
      try {
        return await fetchNamespacePipeline({
          namespacePipelineName,
          accessToken,
          shareCode,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enableQuery,
  });
}
