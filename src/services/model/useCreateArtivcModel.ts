import { useMutation, useQueryClient } from "react-query";
import {
  createArtivcModelMutation,
  CreateArtivcModelPayload,
  Model,
} from "@/lib/instill";

const useCreateArtivcModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateArtivcModelPayload) => {
      const model = await createArtivcModelMutation(payload);
      return Promise.resolve(model);
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["models", newModel.id], newModel);
        queryClient.setQueryData<Model[]>(["models"], (old) =>
          old ? [...old, newModel] : [newModel]
        );
      },
    }
  );
};

export default useCreateArtivcModel;
