import { deleteModelMutation, Model } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (modelName: string) => {
      await deleteModelMutation(modelName);
      return modelName;
    },
    {
      onSuccess: (modelName) => {
        const modelId = modelName.split("/")[1];

        queryClient.removeQueries(["models", modelId], { exact: true });

        const models = queryClient.getQueryData<Model[]>(["models"]);

        if (models) {
          queryClient.setQueryData<Model[]>(
            ["models"],
            models.filter((e) => e.name !== modelName)
          );
        }
      },
    }
  );
};

export default useDeleteModel;
