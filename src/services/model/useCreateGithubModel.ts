import { useMutation, useQueryClient } from "react-query";
import {
  createGithubModelMutation,
  CreateGithubModelPayload,
} from "@/lib/instill";

export const useCreateGithubModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: CreateGithubModelPayload) => {
      const operation = await createGithubModelMutation(payload);
      return Promise.resolve({ operation });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["models"]);
      },
    }
  );
};
