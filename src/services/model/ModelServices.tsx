// ###################################################################
// #                                                                 #
// # Model                                                           #
// #                                                                 #
// ###################################################################

import { listModelInstancesQuery, listModelsQuery } from "@/lib/instill";
import { useQuery } from "react-query";

export const useModels = () => {
  return useQuery(["models"], async () => {
    const models = await listModelsQuery();
    return Promise.resolve(models);
  });
};

// ###################################################################
// #                                                                 #
// # Model Instance                                                  #
// #                                                                 #
// ###################################################################

export const useModeInstances = (modelId: string[]) => {
  return useQuery(
    ["modelInstances"],
    async () => {
      const modelInstances = [];

      for (const id of modelId) {
        const instances = await listModelInstancesQuery(id);
        modelInstances.push(...instances);
      }

      return Promise.resolve(modelInstances);
    },
    {
      enabled: !!modelId,
    }
  );
};
