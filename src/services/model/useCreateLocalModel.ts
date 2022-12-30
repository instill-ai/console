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

export default useCreateLocalModel;
