import { deleteModelMutation, Model } from "@/lib/instill";
import { useMutation, useQueryClient } from "react-query";

const useDeleteModel = (modelName: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      await deleteModelMutation(modelName);
    },
    {
      onSuccess: () => {
        const modelId = modelName.split("/")[1];

        queryClient.removeQueries(["models", modelId], { exact: true });

        const models = queryClient.getQueryData<Model[]>(["models"]);

        if (models) {
          queryClient.setQueryData<Model[]>(
            ["models"],
            models.filter((e) => e.name !== modelName)
          );
        } else {
          queryClient.invalidateQueries(["models"]);
        }
      },
    }
  );
};

export default useDeleteModel;
