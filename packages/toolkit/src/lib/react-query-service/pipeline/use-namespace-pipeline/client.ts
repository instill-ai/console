"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespacePipeline } from "./server";

export function useNamespacePipeline({
  namespaceId,
  pipelineId,
  accessToken,
  enabled,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  let enableQuery = false;

  if (namespaceId && pipelineId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
      namespaceId,
      pipelineId,
    }),
    queryFn: async () => {
      try {
        return await fetchNamespacePipeline({
          namespaceId,
          pipelineId,
          accessToken,
          shareCode,
          view,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enableQuery,
  });
}
