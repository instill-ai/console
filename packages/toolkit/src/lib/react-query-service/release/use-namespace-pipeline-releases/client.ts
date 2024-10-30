"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespacePipelineReleases } from "./server";

export function useNamespacePipelineReleases({
  namespaceId,
  pipelineId,
  enabled,
  accessToken,
  shareCode,
  view,
}: {
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  shareCode: Nullable<string>;
  view: Nullable<ResourceView>;
}) {
  let enableQuery = false;

  if (namespaceId && pipelineId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.release.getUseNamespacePipelineReleasesQueryKey({
      namespaceId,
      pipelineId,
      view,
      shareCode,
    }),
    queryFn: async () => {
      try {
        return await fetchNamespacePipelineReleases({
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
