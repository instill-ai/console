import { listPipelinesQuery, Pipeline } from "@/lib/instill";
import { useQuery } from "react-query";
import { constructPipelineRecipeWithDefinition } from "../helper";

const usePipelines = (enable: boolean) => {
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
    }
  );
};

export default usePipelines;
