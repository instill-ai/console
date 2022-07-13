import { useMutation, useQueryClient } from "react-query";
import { activatePipelineMutation, Pipeline } from "@/lib/instill";
import { constructPipelineRecipeWithDefinition } from "../helper";

const useActivatePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (pipelineName: string) => {
      const rawPipeline = await activatePipelineMutation(pipelineName);
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

export default useActivatePipeline;
