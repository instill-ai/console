"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespacePipelineRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespaceId,
      pipelineId,
      releaseId,
      accessToken,
    }: {
      namespaceId: string;
      pipelineId: string;
      releaseId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.pipeline.release.deleteNamespacePipelineRelease({
        namespaceId,
        pipelineId,
        releaseId,
      });

      return Promise.resolve({ namespaceId, pipelineId });
    },
    onSuccess: async ({ namespaceId, pipelineId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.release.getUseNamespacePipelineReleasesQueryKey(
          {
            namespaceId,
            pipelineId,
            view: null,
            shareCode: null,
          },
        ),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.release.getUseInfiniteNamespacePipelineReleasesQueryKey(
            {
              namespaceId,
              pipelineId,
              view: null,
              shareCode: null,
            },
          ),
      });
    },
  });
}
