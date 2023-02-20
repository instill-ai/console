import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPipelineQuery, Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { constructPipelineRecipeWithDefinition } from "../helper";

export const usePipeline = (pipelineName: Nullable<string>) => {
  const queryClient = useQueryClient();
  return useQuery(
    ["pipelines", pipelineName],
    async () => {
      if (!pipelineName) {
        return Promise.reject(new Error("invalid pipeline name"));
      }

      const rawPipeline = await getPipelineQuery(pipelineName);
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
      enabled: pipelineName ? true : false,
      initialData: queryClient
        .getQueryData<Pipeline[]>(["pipelines"])
        ?.find((e) => e.name === pipelineName),
      retry: 3,
    }
  );
};
