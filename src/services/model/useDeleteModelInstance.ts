import { ModelInstance } from "@/lib/instill";
import { deleteModelInstanceMutation } from "@/lib/instill/model/mutations";
import { useMutation, useQueryClient } from "react-query";

const useDeleteModelInstance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (modelInstanceName: string) => {
      await deleteModelInstanceMutation(modelInstanceName);
      return modelInstanceName;
    },
    {
      onSuccess: (modelInstanceName) => {
        const modelId = modelInstanceName.split("/")[1];
        const modelInstanceId = modelInstanceName.split("/")[3];

        queryClient.removeQueries(
          ["models", modelId, "instances", modelInstanceId],
          { exact: true }
        );

        const modelInstances = queryClient.getQueryData<ModelInstance[]>([
          "models",
          modelId,
          "instances",
        ]);

        if (modelInstances) {
          queryClient.setQueryData<ModelInstance[]>(
            ["models", modelId, "instances"],
            modelInstances.filter((e) => e.name !== modelInstanceName)
          );
        }
      },
    }
  );
};

export default useDeleteModelInstance;
