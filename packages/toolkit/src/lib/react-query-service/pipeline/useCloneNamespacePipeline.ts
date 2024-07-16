"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloneNamespacePipelineRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

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

      await client.vdp.pipeline.cloneNamespacePipeline(payload);

      return Promise.resolve({ pipelineName: payload.namespacePipelineName });
    },
    onSuccess: async ({ pipelineName }) => {
      const namespace = pipelineName.split("/").splice(0, 2).join("/");
      queryClient.invalidateQueries({ queryKey: ["pipelines", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", namespace, "infinite"],
      });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", namespace],
      });
      queryClient.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });
}
