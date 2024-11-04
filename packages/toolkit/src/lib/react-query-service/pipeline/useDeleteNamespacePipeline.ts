"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      namespaceId,
      pipelineId,
      accessToken,
    }: {
      namespaceId: string;
      pipelineId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.vdp.pipeline.deleteNamespacePipeline({
        namespaceId,
        pipelineId,
      });

      return Promise.resolve({ namespaceId, pipelineId });
    },
    onSuccess: ({ namespaceId, pipelineId }) => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeyStore.pipeline.getUseInfiniteAccessiblePipelinesQueryKey({
            filter: null,
            visibility: null,
            view: null,
            orderBy: null,
          }),
      });

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
        queryKey: queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
          namespaceId,
          pipelineId,
          view: null,
          shareCode: null,
        }),
      });

      queryClient.removeQueries({
        queryKey: queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
          namespaceId,
          pipelineId,
          view: null,
          shareCode: null,
        }),
        exact: true,
      });
    },
  });
}
