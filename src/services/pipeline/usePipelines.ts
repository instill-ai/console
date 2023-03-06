import { listPipelinesQuery, Pipeline } from "@/lib/instill";
import { useQuery } from "@tanstack/react-query";
import {
  constructPipelineRecipeWithDefinition,
  defaultQueryParam,
} from "../helper";

export const usePipelines = (enable: boolean) => {
  return useQuery(
    ["pipelines"],
    async () => {
      const pipelinesWithRawRecipe = await listPipelinesQuery(
        defaultQueryParam.pageSize,
        defaultQueryParam.nextPageToken
      );

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
