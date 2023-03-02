import { useQuery } from "@tanstack/react-query";
import { listModelInstancesQuery } from "@/lib/instill";
import { useModels } from "./useModels";
import { defaultQueryParam } from "../helper";

export const useModelsInstances = (enable: boolean) => {
  const models = useModels();
  return useQuery(
    ["models", "all", "modelInstances"],
    async () => {
      const modelInstances = [];
      if (!models.data) {
        return Promise.reject(new Error("Model data not provided"));
      }

      for (const model of models.data) {
        const instances = await listModelInstancesQuery(
          model.name,
          defaultQueryParam.pageSize,
          defaultQueryParam.nextPageToken
        );
        modelInstances.push(...instances);
      }

      return Promise.resolve(modelInstances);
    },
    {
      enabled: enable ? (models.isSuccess ? true : false) : false,
      retry: 3,
    }
  );
};
