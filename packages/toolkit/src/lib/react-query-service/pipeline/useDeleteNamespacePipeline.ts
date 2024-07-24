"use client";

import type { Pipeline } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useDeleteNamespacePipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      namespacePipelineName,
      accessToken,
    }: {
      namespacePipelineName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.vdp.pipeline.deleteNamespacePipeline({
        namespacePipelineName,
      });

      return Promise.resolve(namespacePipelineName);
    },
    onSuccess: (pipelineName) => {
      // At this stage the pipelineName will be users/<uid>/pipelines/<pid>
      const pipelineNameArray = pipelineName.split("/");
      const userName = `${pipelineNameArray[0]}/${pipelineNameArray[1]}`;

      queryClient.invalidateQueries({ queryKey: ["pipelines", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", userName, "infinite"],
      });

      queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
        old ? old.filter((e) => e.name !== pipelineName) : [],
      );

      queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
        old ? old.filter((e) => e.name !== pipelineName) : [],
      );

      queryClient.removeQueries({
        queryKey: ["pipelines", pipelineName],
        exact: true,
      });

      // Process watch state
      queryClient.removeQueries({
        queryKey: ["pipelines", pipelineName, "watch"],
        exact: true,
      });
    },
  });
}
