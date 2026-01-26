"use client";

import type { CloneNamespacePipelineRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCloneNamespacePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CloneNamespacePipelineRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.pipeline.pipeline.cloneNamespacePipeline(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
      });
    },
    onSuccess: async ({ namespaceId }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.pipeline.getUseInfiniteNamespacePipelinesQueryKey({
            namespaceId,
            filter: null,
            visibility: null,
            view: null,
          }),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeyStore.pipeline.getUseNamespacePipelinesQueryKey({
          namespaceId,
          view: null,
          filter: null,
          visibility: null,
        }),
      });

      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.pipeline.getUseInfiniteAccessiblePipelinesQueryKey({
            filter: null,
            visibility: null,
            view: null,
            orderBy: null,
          }),
      });
    },
  });
}
