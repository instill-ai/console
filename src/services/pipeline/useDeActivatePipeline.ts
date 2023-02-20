import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deActivatePipelineMutation, Pipeline } from "@/lib/instill";
import { constructPipelineRecipeWithDefinition } from "../helper";

export const useDeActivatePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (pipelineName: string) => {
      const rawPipeline = await deActivatePipelineMutation(pipelineName);
      const recipe = await constructPipelineRecipeWithDefinition(
        rawPipeline.recipe
      );

      const pipeline: Pipeline = {
        ...rawPipeline,
        recipe: recipe,
      };

      return Promise.resolve(pipeline);
    },
    {
      onSuccess: (newPipeline) => {
        queryClient.setQueryData<Pipeline>(
          ["pipelines", newPipeline.id],
          newPipeline
        );
        queryClient.setQueryData<Pipeline[]>(["pipelines"], (old) => {
          if (!old) {
            return [newPipeline];
          }

          return [...old.filter((e) => e.id !== newPipeline.id), newPipeline];
        });
      },
    }
  );
};
