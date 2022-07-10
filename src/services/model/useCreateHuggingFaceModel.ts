import { useMutation, useQueryClient } from "react-query";
import {
  createHuggingFaceModelMutation,
  CreateHuggingFaceModelPayload,
  Model,
} from "@/lib/instill";

const useCreateHuggingFaceModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateHuggingFaceModelPayload) => {
      const model = await createHuggingFaceModelMutation(payload);
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

export default useCreateHuggingFaceModel;
