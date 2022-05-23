// ###################################################################
// #                                                                 #
// # Model                                                           #
// #                                                                 #
// ###################################################################

import {
  createModelMutation,
  CreateModelPayload,
  deployModelAction,
  getModelDefinitionQuery,
  getModelInstanceQuery,
  listModelDefinitionsQuery,
  listModelInstancesQuery,
  listModelsQuery,
  Model,
} from "@/lib/instill";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useModels = () => {
  return useQuery(["models"], async () => {
    const models = await listModelsQuery();
    return Promise.resolve(models);
  });
};

export const useCreateModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateModelPayload) => {
      const model = await createModelMutation(payload);
      return model;
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["user", newModel.id], newModel);
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

export const useModelDefinition = (modelDefinitionId: string | undefined) => {
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
// # Model Instance                                                  #
// #                                                                 #
// ###################################################################

export const useAllModeInstances = () => {
  const models = useModels();
  return useQuery(
    ["models", "all", "modelInstances"],
    async () => {
      const modelInstances = [];
      if (!models.data) {
        return Promise.reject(new Error("Model data not provided"));
      }

      for (const model of models.data) {
        const instances = await listModelInstancesQuery(model.id);
        modelInstances.push(...instances);
      }

      return Promise.resolve(modelInstances);
    },
    {
      enabled: !!models.isSuccess,
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

      const modelInstances = await listModelInstancesQuery(modelId);
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

export const useDeployModel = () => {
  return useMutation(async (modelInstanceName: string) => {
    const modelInstance = await deployModelAction(modelInstanceName);
    return Promise.resolve(modelInstance);
  });
};
