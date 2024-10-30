"use client";

import type {
  Nullable,
  Pipeline,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useUpdateNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      props: UpdateNamespacePipelineRequest & {
        accessToken: Nullable<string>;
      },
    ) => {
      const { accessToken, ...payload } = props;

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const pipeline =
        await client.vdp.pipeline.updateNamespacePipeline(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
        pipelineId: payload.pipelineId,
        pipeline,
      });
    },
    onSuccess: async ({ namespaceId, pipelineId, pipeline }) => {
      queryClient.setQueryData<Pipeline>(
        queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
          namespaceId,
          pipelineId,
        }),
        pipeline,
      );

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
          queryKeyStore.pipeline.getUseInfiniteNamespacePipelinesQueryKey({
            namespaceId,
            filter: null,
            visibility: null,
            view: null,
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
