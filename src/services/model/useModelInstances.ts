import { useQuery } from "react-query";
import { listModelInstancesQuery } from "@/lib/instill";
import { Nullable } from "@/types/general";

export const useModelInstances = (modelName: Nullable<string>) => {
  return useQuery(
    ["models", modelName?.split("/")[1], "modelInstances"],
    async () => {
      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const modelInstances = await listModelInstancesQuery(modelName);
      return Promise.resolve(modelInstances);
    },
    {
      enabled: modelName ? true : false,
      retry: 3,
    }
  );
};
