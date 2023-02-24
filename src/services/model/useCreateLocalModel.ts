import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLocalModelMutation,
  CreateLocalModelPayload,
} from "@/lib/instill";

export const useCreateLocalModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateLocalModelPayload) => {
      const operation = await createLocalModelMutation(payload);
      return Promise.resolve({ operation });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["models"]);
      },
    }
  );
};
