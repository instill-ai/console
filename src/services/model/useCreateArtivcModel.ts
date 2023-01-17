import { useMutation, useQueryClient } from "react-query";
import {
  createArtivcModelMutation,
  CreateArtivcModelPayload,
} from "@/lib/instill";

export const useCreateArtivcModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateArtivcModelPayload) => {
      const operation = await createArtivcModelMutation(payload);
      return Promise.resolve({ operation });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["models"]);
      },
    }
  );
};
