import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserModelMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      modelName,
      accessToken,
    }: {
      modelName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      await deleteUserModelMutation({ modelName, accessToken });

      return Promise.resolve({ modelName, accessToken });
    },
    onSuccess: async ({ modelName, accessToken }) => {
      await onSuccessAfterModelMutation({
        type: "create",
        queryClient,
        modelName,
        accessToken,
      });
    },
  });
}
