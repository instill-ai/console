import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserPipelineMutation,
  type CreateUserPipelinePayload,
  type Pipeline,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useCreateUserPipeline() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
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
    {
      onSuccess: async ({ pipeline, entityName }) => {
        queryClient.setQueryData<Pipeline>(
          ["pipelines", pipeline.name],
          pipeline
        );

        queryClient.invalidateQueries(["pipelines", "infinite"]);
        queryClient.invalidateQueries(["pipelines", entityName, "infinite"]);

        queryClient.setQueryData<Pipeline[]>(
          ["pipelines", entityName],
          (old) =>
            old
              ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
              : [pipeline]
        );

        queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
          old
            ? [...old.filter((e) => e.name !== pipeline.name), pipeline]
            : [pipeline]
        );
      },
    }
  );
}
