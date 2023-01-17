import { useMutation, useQueryClient } from "react-query";
import {
  Pipeline,
  updatePipelineMutation,
  UpdatePipelinePayload,
} from "@/lib/instill";
import { constructPipelineRecipeWithDefinition } from "../helper";

export const useUpdatePipeline = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: UpdatePipelinePayload) => {
      const rawPipeline = await updatePipelineMutation(payload);

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
          ["pipelines", newPipeline.name],
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
