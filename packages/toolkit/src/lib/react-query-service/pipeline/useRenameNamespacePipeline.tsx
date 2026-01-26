"use client";

import type { Nullable, RenameNamespacePipelineRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useRenameNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: RenameNamespacePipelineRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.pipeline.pipeline.renameNamespacePipeline(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
        oldPipelineId: payload.pipelineId,
      });
    },
    onSuccess: async ({ namespaceId, oldPipelineId }) => {
      queryClient.removeQueries({
        queryKey: queryKeyStore.pipeline.getUseNamespacePipelineQueryKey({
          namespaceId,
          pipelineId: oldPipelineId,
          view: null,
          shareCode: null,
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
    },
  });
}
