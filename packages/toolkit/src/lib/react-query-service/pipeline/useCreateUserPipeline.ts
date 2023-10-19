import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserPipelineMutation,
  type CreateUserPipelinePayload,
  type Pipeline,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useCreateUserPipeline = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      userName,
      payload,
      accessToken,
    }: {
      userName: string;
      payload: CreateUserPipelinePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const pipeline = await createUserPipelineMutation({
        userName,
        payload,
        accessToken,
      });

      return Promise.resolve({ pipeline, userName });
    },
    {
      onSuccess: async ({ pipeline, userName }) => {
        queryClient.setQueryData<Pipeline>(
          ["pipelines", pipeline.name],
          pipeline
        );

        queryClient.setQueryData<Pipeline[]>(["pipelines", userName], (old) =>
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
};
