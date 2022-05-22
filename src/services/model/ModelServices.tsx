// ###################################################################
// #                                                                 #
// # Model                                                           #
// #                                                                 #
// ###################################################################

import {
  listModelDefinitionsQuery,
  listModelInstancesQuery,
  listModelsQuery,
} from "@/lib/instill";
import { useQuery } from "react-query";

export const useModels = () => {
  return useQuery(["models"], async () => {
    const models = await listModelsQuery();
    return Promise.resolve(models);
  });
};

export const useModelDefinitions = () => {
  return useQuery(["models", "definition"], async () => {
    const definitions = await listModelDefinitionsQuery();
    return Promise.resolve(definitions);
  });
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
