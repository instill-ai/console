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

export default useCreateArtivcModel;
