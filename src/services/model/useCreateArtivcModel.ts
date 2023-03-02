import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        queryClient.invalidateQueries({ queryKey: ["models"] });
        queryClient.invalidateQueries({
          queryKey: ["models", "with-instances"],
        });
      },
    }
  );
};
