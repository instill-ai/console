import { getModelInstanceQuery } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useQuery } from "react-query";

const useModelInstance = (modelInstanceName: Nullable<string>) => {
  return useQuery(
    [
      "models",
      modelInstanceName?.split("/")[1],
      "modelInstances",
      modelInstanceName,
    ],
    async () => {
      if (!modelInstanceName) {
        return Promise.reject(new Error("Model instance name not provided"));
      }
      const modelInstances = await getModelInstanceQuery(modelInstanceName);
      return Promise.resolve(modelInstances);
    },
    {
      enabled: modelInstanceName ? true : false,
      retry: 3,
    }
  );
};

export default useModelInstance;
