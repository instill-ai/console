import { listRepoFileContent } from "@/lib/github";
import {
  getDestinationQuery,
  getModelInstanceQuery,
  getPipelineQuery,
  getSourceQuery,
  listPipelinesQuery,
  RawPipelineRecipe,
} from "@/lib/instill";
import type {
  Pipeline,
  PipelineMode,
  PipelineRecipe,
  ModelInstance,
} from "@/lib/instill";
import type { Mode } from "@/types/general";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";

export const mockPipelines: Pipeline[] = [
  {
    id: "yet-another-mock-pipeline-1",
    description: "helllo",
    mode: "MODE_SYNC",
    state: "STATE_ACTIVE",
    createTime: "2022-05-06T09:00:00",
    updateTime: "2022-05-06T09:00:00",
    user: "test_user",
    org: "test_org",
    recipe: {
      source: {
        id: "pipeline-1-source",
        description: "hi",
        createTime: "2022-05-17T09:17:14.223Z",
        updateTime: "2022-05-17T09:17:14.223Z",
        definition: "definition",
        user: "test_user",
        org: "test_org",
      },
      destination: {
        id: "pipeline-1-destination",
        description: "hi",
        createTime: "2022-05-17T09:17:14.223Z",
        updateTime: "2022-05-17T09:17:14.223Z",
        definition: "definition",
        user: "test_user",
        org: "test_org",
      },
      models: [
        {
          id: "pipeline-1-model",
          state: "STATE_ONLINE",
          task: "task1",
          modelDefinition: "definition",
          configuration: "hi",
          createTime: "2022-05-17T09:17:14.223Z",
          updateTime: "2022-05-17T09:17:14.223Z",
        },
      ],
    },
  },
  {
    id: "yet-another-mock-pipeline-1",
    description: "helllo",
    mode: "MODE_SYNC",
    state: "STATE_ACTIVE",
    createTime: "2022-05-06T09:00:00",
    updateTime: "2022-05-06T09:00:00",
    user: "test_user",
    org: "test_org",
    recipe: {
      source: {
        id: "pipeline-1-source",
        description: "hi",
        createTime: "2022-05-17T09:17:14.223Z",
        updateTime: "2022-05-17T09:17:14.223Z",
        definition: "definition",
        user: "test_user",
        org: "test_org",
      },
      destination: {
        id: "pipeline-1-destination",
        description: "hi",
        createTime: "2022-05-17T09:17:14.223Z",
        updateTime: "2022-05-17T09:17:14.223Z",
        definition: "definition",
        user: "test_user",
        org: "test_org",
      },
      models: [
        {
          id: "pipeline-1-model",
          state: "STATE_ONLINE",
          task: "task1",
          modelDefinition: "definition",
          configuration: "hi",
          createTime: "2022-05-17T09:17:14.223Z",
          updateTime: "2022-05-17T09:17:14.223Z",
        },
      ],
    },
  },
];

export const transformMode = (mode: PipelineMode): Mode => {
  if (mode === "MODE_ASYNC") return "async";
  else if (mode === "MODE_SYNC") return "sync";
  else return "unspecific";
};

export const constructPipelineRecipe = async (
  rawRecipe: RawPipelineRecipe
): Promise<PipelineRecipe> => {
  try {
    const source = await getSourceQuery(rawRecipe.source);
    const destination = await getDestinationQuery(rawRecipe.destination);
    const instances: ModelInstance[] = [];

    for (const modelInstanceId of rawRecipe.model_instances) {
      const modelInstance = await getModelInstanceQuery(modelInstanceId);
      instances.push(modelInstance);
    }

    const recipe: PipelineRecipe = {
      source: source,
      destination: destination,
      models: instances,
    };

    return Promise.resolve(recipe);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const usePipeline = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery(
    ["pipelines", id],
    async () => {
      if (!id) {
        return Promise.reject(new Error("invalid id"));
      }

      const rawPipeline = await getPipelineQuery(id);
      const recipe = await constructPipelineRecipe(rawPipeline.recipe);

      const pipeline: Pipeline = {
        id: rawPipeline.id,
        description: rawPipeline.description,
        mode: rawPipeline.mode,
        state: rawPipeline.state,
        createTime: rawPipeline.createTime,
        updateTime: rawPipeline.updateTime,
        recipe: recipe,
        user: rawPipeline.user,
        org: rawPipeline.org,
      };

      return Promise.resolve(pipeline);
    },
    {
      enabled: id ? true : false,
      initialData: queryClient
        .getQueryData<Pipeline[]>(["pipelines"])
        ?.find((e) => e.id === id),
    }
  );
};

export const usePipelines = (enable: boolean) => {
  const fetchPipelines = async () => {
    const pipelinesWithRawRecipe = await listPipelinesQuery();

    const pipelines: Pipeline[] = [];

    for (const pipeline of pipelinesWithRawRecipe) {
      const recipe = await constructPipelineRecipe(pipeline.recipe);
      pipelines.push({
        id: pipeline.id,
        description: pipeline.description,
        mode: pipeline.mode,
        state: pipeline.state,
        user: pipeline.user,
        org: pipeline.org,
        createTime: pipeline.createTime,
        updateTime: pipeline.updateTime,
        recipe: recipe,
      });
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
