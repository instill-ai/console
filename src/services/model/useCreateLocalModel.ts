import { useMutation, useQueryClient } from "react-query";
import {
  createLocalModelMutation,
  CreateLocalModelPayload,
  Model,
} from "@/lib/instill";

const useCreateLocalModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateLocalModelPayload) => {
      const model = await createLocalModelMutation(payload);
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

export default useCreateLocalModel;
