import {
  createGithubModelMutation,
  CreateGithubModelPayload,
  createLocalModelMutation,
  CreateLocalModelPayload,
  deployModelInstanceAction,
  getModelDefinitionQuery,
  getModelInstanceQuery,
  getModelQuery,
  listModelDefinitionsQuery,
  listModelInstancesQuery,
  listModelsQuery,
  Model,
  ModelWithInstance,
  updateModelMutation,
  UpdateModelPayload,
} from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useMutation, useQuery, useQueryClient } from "react-query";

// ###################################################################
// #                                                                 #
// # [Query] Model                                                   #
// #                                                                 #
// ###################################################################

export const useModel = (modelName: Nullable<string>) => {
  return useQuery(
    ["models", modelName],
    async () => {
      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const model = await getModelQuery(modelName);

      return Promise.resolve(model);
    },
    {
      enabled: modelName ? true : false,
    }
  );
};

export const useModels = () => {
  return useQuery(["models"], async () => {
    const models = await listModelsQuery();
    return Promise.resolve(models);
  });
};

// ###################################################################
// #                                                                 #
// # [Mutation] Model                                                #
// #                                                                 #
// ###################################################################

export const useCreateGithubModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateGithubModelPayload) => {
      const model = await createGithubModelMutation(payload);
      return Promise.resolve(model);
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["user", newModel.id], newModel);
      },
    }
  );
};

export const useCreateLocalModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateLocalModelPayload) => {
      const model = await createLocalModelMutation(payload);
      return Promise.resolve(model);
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["user", newModel.id], newModel);
      },
    }
  );
};

export const useUpdateModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: UpdateModelPayload) => {
      const model = await updateModelMutation(payload);
      return Promise.resolve(model);
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["models", newModel.id], newModel);
      },
    }
  );
};

// ###################################################################
// #                                                                 #
// # Model definition                                                #
// #                                                                 #
// ###################################################################

export const useModelDefinitions = () => {
  return useQuery(["models", "definition"], async () => {
    const definitions = await listModelDefinitionsQuery();
    return Promise.resolve(definitions);
  });
};

export const useModelDefinition = (modelDefinitionId: string | null) => {
  return useQuery(
    ["models", "definition", modelDefinitionId],
    async () => {
      if (!modelDefinitionId) {
        return Promise.reject(new Error("Model definition id not found"));
      }

      const definition = await getModelDefinitionQuery(modelDefinitionId);
      return Promise.resolve(definition);
    },
    { enabled: !!modelDefinitionId }
  );
};

// ###################################################################
// #                                                                 #
// # [Query] Model Instance                                          #
// #                                                                 #
// ###################################################################

export const useAllModeInstances = (enable: boolean) => {
  const models = useModels();
  return useQuery(
    ["models", "all", "modelInstances"],
    async () => {
      const modelInstances = [];
      if (!models.data) {
        return Promise.reject(new Error("Model data not provided"));
      }

      for (const model of models.data) {
        const instances = await listModelInstancesQuery(model.name);
        modelInstances.push(...instances);
      }

      return Promise.resolve(modelInstances);
    },
    {
      enabled: enable ? (models.isSuccess ? true : false) : false,
    }
  );
};

export const useModelInstances = (modelId: string | undefined) => {
  return useQuery(
    ["models", modelId, "modelInstances"],
    async () => {
      if (!modelId) {
        return Promise.reject(new Error("Model id not provided"));
      }

      const modelInstances = await listModelInstancesQuery(`models/${modelId}`);
      return Promise.resolve(modelInstances);
    },
    {
      enabled: !!modelId,
    }
  );
};

export const useModelInstance = (modelInstanceId: string | undefined) => {
  return useQuery(
    ["models", "all", "modelInstances", modelInstanceId],
    async () => {
      if (!modelInstanceId) {
        return Promise.reject(new Error("Model instance id not provided"));
      }
      const modelInstances = await getModelInstanceQuery(modelInstanceId);
      return Promise.resolve(modelInstances);
    },
    {
      enabled: !!modelInstanceId,
    }
  );
};

export const useModelWithInstances = (model: Model | null) => {
  const modelId = model?.id;
  return useQuery(
    ["models", "with-instances", modelId],
    async () => {
      if (!model) {
        return Promise.reject(new Error("Model data not provided"));
      }

      const modelInstances = await listModelInstancesQuery(model.name);

      const modelWithInstances: ModelWithInstance = {
        ...model,
        instances: modelInstances,
      };

      return Promise.resolve(modelWithInstances);
    },
    { enabled: !!modelId }
  );
};

export const useModelsWithInstances = () => {
  const models = useModels();
  return useQuery(
    ["models", "with-instances"],
    async () => {
      if (!models.data) {
        return Promise.reject(new Error("Models data not provided"));
      }

      const modelsWithInstances: ModelWithInstance[] = [];

      for (const model of models.data) {
        const modelInstances = await listModelInstancesQuery(model.name);
        modelsWithInstances.push({
          ...model,
          instances: modelInstances,
        });
      }

      return Promise.resolve(modelsWithInstances);
    },
    {
      enabled: models.isSuccess ? true : false,
    }
  );
};

// ###################################################################
// #                                                                 #
// # [Action] Model Instance                                         #
// #                                                                 #
// ###################################################################

export const useDeployModelInstance = () => {
  return useMutation(async (modelInstanceName: string) => {
    const modelInstance = await deployModelInstanceAction(modelInstanceName);
    return Promise.resolve(modelInstance);
  });
};
