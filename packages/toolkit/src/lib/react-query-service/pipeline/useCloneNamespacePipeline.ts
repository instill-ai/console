import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import type { Pipeline } from "../../vdp-sdk";
import {
  cloneNamespacePipelineMutation,
  CloneNamespacePipelinePayload,
} from "../../vdp-sdk";

export function useCloneNamespacePipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CloneNamespacePipelinePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipeline = await cloneNamespacePipelineMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ pipeline });
    },
    onSuccess: async ({ pipeline }) => {
      const namespace = pipeline.name.split("/").splice(0, 2).join("/");

      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline,
      );

      queryClient.invalidateQueries({ queryKey: ["pipelines", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", namespace, "infinite"],
      });

      queryClient.setQueryData<Pipeline[]>(["pipelines", namespace], (old) =>
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
