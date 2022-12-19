import { useMutation, useQueryClient } from "react-query";
import {
  deployModelInstanceAction,
  ModelInstance,
  getModelInstanceQuery,
} from "@/lib/instill";

const useDeployModelInstance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (modelInstanceName: string) => {
      try {
        const operation = await deployModelInstanceAction(modelInstanceName);

        // Get the current model instance staus
        const modelInstance = await getModelInstanceQuery(modelInstanceName);
        return Promise.resolve({ modelInstance, operation });
      } catch (err) {
        return Promise.reject(err);
      }
    },
    {
      onSuccess: ({ modelInstance }) => {
        const modelId = modelInstance.name.split("/")[1];

        queryClient.setQueryData<ModelInstance>(
          ["models", modelId, "modelInstances", modelInstance.id],
          modelInstance
        );

        queryClient.setQueryData<ModelInstance[]>(
          ["models", modelId, "modelInstances"],
          (old) => {
            if (!old) {
              return [modelInstance];
            }

            return [
              ...old.filter((e) => e.id !== modelInstance.id),
              modelInstance,
            ];
          }
        );
      },
    }
  );
};

export default useDeployModelInstance;
