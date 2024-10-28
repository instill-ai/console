"use client";

import type { CreateNamespacePipelineRequest, Pipeline } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../sdk-helper";

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
        await client.vdp.pipeline.createNamespacePipeline(payload);

      return Promise.resolve({
        pipeline,
        namespaceName: payload.namespaceName,
      });
    },
    onSuccess: async ({ pipeline, namespaceName }) => {
      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline,
      );
      queryClient.invalidateQueries({ queryKey: ["pipelines", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", namespaceName, "infinite"],
      });
      queryClient.setQueryData<Pipeline[]>(
        ["pipelines", namespaceName],
        (old) =>
          old
            ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
            : [pipeline],
      );
      queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
        old
          ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
          : [pipeline],
      );
    },
  });
}
