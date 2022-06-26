import { useMutation, useQueryClient } from "react-query";
import { ModelInstance, udDeployModelInstanceAction } from "@/lib/instill";

const useUnDeployModelInstance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (modelInstanceName: string) => {
      const modelInstance = await udDeployModelInstanceAction(
        modelInstanceName
      );
      return Promise.resolve(modelInstance);
    },
    {
      onSuccess: (newModelInstance) => {
        const modelId = newModelInstance.name.split("/")[1];

        queryClient.setQueryData<ModelInstance>(
          ["models", modelId, "modelInstances", newModelInstance.id],
          newModelInstance
        );

        queryClient.setQueryData<ModelInstance[]>(
          ["models", modelId, "modelInstances"],
          (old) => {
            if (!old) {
              return [newModelInstance];
            }

            return [
              ...old.filter((e) => e.id !== newModelInstance.id),
              newModelInstance,
            ];
          }
        );
      },
    }
  );
};

export default useUnDeployModelInstance;
