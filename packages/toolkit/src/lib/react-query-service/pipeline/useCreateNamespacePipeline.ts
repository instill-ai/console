"use client";

import type { CreateNamespacePipelineRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespacePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespacePipelineRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipeline =
        await client.pipeline.pipeline.createNamespacePipeline(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
        pipeline,
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
