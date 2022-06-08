import { useMutation, useQueryClient } from "react-query";
import { Model, updateModelMutation, UpdateModelPayload } from "@/lib/instill";

const useUpdateModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: UpdateModelPayload) => {
      const model = await updateModelMutation(payload);
      return Promise.resolve(model);
    },
    {
      onSuccess: (newModel) => {
        queryClient.setQueryData<Model>(["models", newModel.id], newModel);
        queryClient.setQueryData<Model[]>(["models"], (old) => {
          if (!old) {
            return [newModel];
          }

          return [...old.filter((e) => e.id !== newModel.id), newModel];
        });
      },
    }
  );
};

export default useUpdateModel;
