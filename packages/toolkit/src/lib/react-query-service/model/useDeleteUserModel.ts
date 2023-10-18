import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserModelMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export const useDeleteModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
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
    {
      onSuccess: async ({ modelName, accessToken }) => {
        await onSuccessAfterModelMutation({
          type: "create",
          queryClient,
          modelName,
          accessToken,
        });
      },
    }
  );
};
