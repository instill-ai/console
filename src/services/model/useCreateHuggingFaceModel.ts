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
      const operation = await createHuggingFaceModelMutation(payload);
      return Promise.resolve({ operation });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["models"]);
      },
    }
  );
};

export default useCreateHuggingFaceModel;
