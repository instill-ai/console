import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPipelineMutation,
  CreatePipelinePayload,
  Pipeline,
} from "@/lib/instill";
import { constructPipelineRecipeWithDefinition } from "../helper";

export const useCreatePipeline = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (payload: CreatePipelinePayload) => {
      const res = await createPipelineMutation(payload);
      return Promise.resolve(res);
    },
    {
      onSuccess: async (newPipeline) => {
        const recipe = await constructPipelineRecipeWithDefinition(
          newPipeline.recipe
        );

        const pipeline: Pipeline = {
          ...newPipeline,
          recipe: recipe,
        };

        queryClient.setQueryData<Pipeline>(
          ["pipelines", newPipeline.id],
          pipeline
        );

        queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) =>
          old
            ? [...old.filter((e) => e.id !== newPipeline.id), pipeline]
            : [pipeline]
        );
      },
    }
  );
};
