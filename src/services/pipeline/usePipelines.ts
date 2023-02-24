import { listPipelinesQuery, Pipeline } from "@/lib/instill";
import { useQuery } from "@tanstack/react-query";
import { constructPipelineRecipeWithDefinition } from "../helper";

export const usePipelines = (enable: boolean) => {
  return useQuery(
    ["pipelines"],
    async () => {
      const pipelinesWithRawRecipe = await listPipelinesQuery();

      const pipelines: Pipeline[] = [];

      for (const pipeline of pipelinesWithRawRecipe) {
        const recipe = await constructPipelineRecipeWithDefinition(
          pipeline.recipe
        );
        pipelines.push({ ...pipeline, recipe: recipe });
      }

      return pipelines;
    },
    {
      enabled: enable ? true : false,
      retry: 3,
    }
  );
};
