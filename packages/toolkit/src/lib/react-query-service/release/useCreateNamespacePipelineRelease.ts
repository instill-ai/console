"use client";

import type {
  CreateNamespacePipelineReleaseRequest,
  Nullable,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespacePipelineRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespacePipelineReleaseRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.pipeline.release.createNamespacePipelineRelease(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
        pipelineId: payload.pipelineId,
      });
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
