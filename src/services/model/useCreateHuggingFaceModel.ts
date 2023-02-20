import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createHuggingFaceModelMutation,
  CreateHuggingFaceModelPayload,
} from "@/lib/instill";

export const useCreateHuggingFaceModel = () => {
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
