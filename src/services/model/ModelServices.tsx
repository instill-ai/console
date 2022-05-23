// ###################################################################
// #                                                                 #
// # Model                                                           #
// #                                                                 #
// ###################################################################

import {
  createModelMutation,
  CreateModelPayload,
  getModelDefinitionQuery,
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

export const useModeInstances = () => {
  const models = useModels();
  return useQuery(
    ["modelInstances"],
    async () => {
      const modelInstances = [];
      if (!models.data) {
        return Promise.reject(new Error("Model data not found"));
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
