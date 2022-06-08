import { useMutation, useQueryClient } from "react-query";
import {
  createGithubModelMutation,
  CreateGithubModelPayload,
  Model,
} from "@/lib/instill";

const useCreateGithubModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateGithubModelPayload) => {
      const model = await createGithubModelMutation(payload);
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

export default useCreateGithubModel;
