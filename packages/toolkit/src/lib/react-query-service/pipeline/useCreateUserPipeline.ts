import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import type { CreateUserPipelinePayload, Pipeline } from "../../vdp-sdk";
import { createUserPipelineMutation } from "../../vdp-sdk";

export function useCreateUserPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      entityName,
      payload,
      accessToken,
    }: {
      entityName: string;
      payload: CreateUserPipelinePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipeline = await createUserPipelineMutation({
        entityName,
        payload,
        accessToken,
      });

      return Promise.resolve({ pipeline, entityName });
    },
    onSuccess: async ({ pipeline, entityName }) => {
      queryClient.setQueryData<Pipeline>(
        ["pipelines", pipeline.name],
        pipeline,
      );

      queryClient.invalidateQueries({ queryKey: ["pipelines", "infinite"] });
      queryClient.invalidateQueries({
        queryKey: ["pipelines", entityName, "infinite"],
      });

      queryClient.setQueryData<Pipeline[]>(["pipelines", entityName], (old) =>
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
