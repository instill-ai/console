"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespacePipelineRelease({
  enabled,
  accessToken,
  namespaceId,
  pipelineId,
  releaseId,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  namespaceId: Nullable<string>;
  pipelineId: Nullable<string>;
  releaseId: Nullable<string>;
  retry?: boolean;
}) {
  return useQuery({
    retry,
    queryKey: queryKeyStore.release.getUseNamespacePipelineReleaseQueryKey({
      namespaceId,
      pipelineId,
      releaseId,
    }),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      if (!pipelineId) {
        return Promise.reject(new Error("pipelineId not provided"));
      }

      if (!releaseId) {
        return Promise.reject(new Error("releaseId not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const data = await client.pipeline.release.GetNamespacePipelineRelease({
        namespaceId,
        pipelineId,
        releaseId,
      });

      return Promise.resolve(data);
    },
    enabled,
  });
}
