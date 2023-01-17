import { useQuery } from "react-query";
import { listModelInstancesQuery, ModelWithInstance } from "@/lib/instill";
import { determineModelState } from "@/utils";
import useModels from "./useModels";

const useModelsWithInstances = () => {
  const models = useModels();
  return useQuery(
    ["models", "with-instances"],
    async () => {
      if (!models.data) {
        return Promise.reject(new Error("Models data not provided"));
      }

      const modelsWithInstances: ModelWithInstance[] = [];

      // ###################################################################
      // #                                                                 #
      // # Prepare model state overview counts                             #
      // #                                                                 #
      // ###################################################################
      //
      // - Becasuse model itself doesn't have state, we have to conclude model
      // state using model_instance state.
      // - model_instance.error > model_instance.online > model_instance.offline
      // - Model state will be error if there exist a error model_insance

      for (const model of models.data) {
        const modelInstances = await listModelInstancesQuery(model.name);
        modelsWithInstances.push({
          ...model,
          instances: modelInstances,
          state: determineModelState(modelInstances),
        });
      }

      return Promise.resolve(modelsWithInstances);
    },
    {
      enabled: models.isSuccess ? true : false,
      retry: 3,
    }
  );
};

export default useModelsWithInstances;
