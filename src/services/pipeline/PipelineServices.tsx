import { listRepoFileContent } from "@/lib/github";
import {
  createPipelineMutation,
  CreatePipelinePayload,
  getDestinationDefinitionQuery,
  getDestinationQuery,
  getModelInstanceQuery,
  getPipelineQuery,
  getSourceDefinitionQuery,
  getSourceQuery,
  listPipelinesQuery,
  RawPipelineRecipe,
  updatePipelineMutation,
  UpdatePipelinePayload,
} from "@/lib/instill";
import type { Pipeline, PipelineRecipe, ModelInstance } from "@/lib/instill";
import type { Nullable } from "@/types/general";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const constructPipelineRecipeWithDefinition = async (
  rawRecipe: RawPipelineRecipe
): Promise<PipelineRecipe> => {
  try {
    const source = await getSourceQuery(rawRecipe.source);
    const sourceDefinition = await getSourceDefinitionQuery(
      source.source_connector_definition
    );
    const destination = await getDestinationQuery(rawRecipe.destination);
    const destinationDefinition = await getDestinationDefinitionQuery(
      destination.destination_connector_definition
    );
    const instances: ModelInstance[] = [];

    for (const modelInstanceName of rawRecipe.model_instances) {
      const modelInstance = await getModelInstanceQuery(modelInstanceName);
      instances.push(modelInstance);
    }

    const recipe: PipelineRecipe = {
      source: { ...source, source_connector_definition: sourceDefinition },
      destination: {
        ...destination,
        destination_connector_definition: destinationDefinition,
      },
      models: instances,
    };

    return Promise.resolve(recipe);
  } catch (err) {
    return Promise.reject(err);
  }
};

// ###################################################################
// #                                                                 #
// # [Query] Pipeline.                                               #
// #                                                                 #
// ###################################################################

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
    }
  );
};

export const usePipelines = (enable: boolean) => {
  const fetchPipelines = async () => {
    const pipelinesWithRawRecipe = await listPipelinesQuery();

    const pipelines: Pipeline[] = [];

    for (const pipeline of pipelinesWithRawRecipe) {
      const recipe = await constructPipelineRecipeWithDefinition(
        pipeline.recipe
      );
      pipelines.push({ ...pipeline, recipe: recipe });
    }

    return pipelines;
  };

  return useQuery(["pipelines"], fetchPipelines, {
    enabled: enable ? true : false,
  });
};

export const usePipelineSchema = () => {
  const fetchPipelineSchema = async (): Promise<string> => {
    const data = await listRepoFileContent(
      "instill-ai",
      "pipeline-backend",
      "configs/models/pipeline.json"
    );
    return data.content;
  };

  const queryInfo = useQuery(
    ["pipeline", "encoded-definition"],
    fetchPipelineSchema
  );

  return {
    ...queryInfo,
    data: useMemo(() => {
      if (queryInfo.data) {
        return JSON.parse(window.atob(queryInfo.data));
      }
    }, [queryInfo.data]),
  };
};

export const usePipelinesHaveTargetSource = (sourceId: string | undefined) => {
  const pipelines = usePipelines(true);
  const queryClient = useQueryClient();

  return useQuery(
    ["pipelines", "pipelines-with-source", sourceId],
    async () => {
      const targetPipelines = [];

      if (!pipelines.data) {
        return Promise.reject("pipelines not exist");
      }

      for (const pipeline of pipelines.data) {
        if (pipeline.recipe.source.id === sourceId) {
          targetPipelines.push(pipeline);
        }
      }

      return Promise.resolve(targetPipelines);
    },
    {
      initialData: () => {
        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          const targetPipelines = [];

          for (const pipeline of pipelines) {
            if (pipeline.recipe.source.id === sourceId) {
              targetPipelines.push(pipeline);
            }
          }

          return targetPipelines;
        }
      },
      enabled: sourceId ? (pipelines.data ? true : false) : false,
    }
  );
};

export const usePipelinesHaveTargetDestination = (
  destinationId: string | undefined
) => {
  const pipelines = usePipelines(true);
  const queryClient = useQueryClient();

  return useQuery(
    ["pipelines", "pipelines-with-destination", destinationId],
    async () => {
      const targetPipelines = [];

      if (!pipelines.data) {
        return Promise.reject("pipelines not exist");
      }

      for (const pipeline of pipelines.data) {
        if (pipeline.recipe.destination.id === destinationId) {
          targetPipelines.push(pipeline);
        }
      }

      return Promise.resolve(targetPipelines);
    },
    {
      initialData: () => {
        const pipelines = queryClient.getQueryData<Pipeline[]>(["pipelines"]);

        if (pipelines) {
          const targetPipelines = [];

          for (const pipeline of pipelines) {
            if (pipeline.recipe.destination.id === destinationId) {
              targetPipelines.push(pipeline);
            }
          }

          return targetPipelines;
        }
      },
      enabled: destinationId ? (pipelines.data ? true : false) : false,
    }
  );
};

// ###################################################################
// #                                                                 #
// # [Mutation] Pipeline.                                            #
// #                                                                 #
// ###################################################################

export const useCreatePipeline = () => {
  return useMutation(async (payload: CreatePipelinePayload) => {
    const res = await createPipelineMutation(payload);
    return Promise.resolve(res);
  });
};

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
