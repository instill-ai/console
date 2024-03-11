import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserModelPayload, createUserModelMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useCreateUserModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userName,
      payload,
      accessToken,
    }: {
      userName: string;
      payload: CreateUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const operation = await createUserModelMutation({
        userName,
        payload,
        accessToken,
      });

      return Promise.resolve({
        operation,
        accessToken,
        modelName: `${userName}/models/${payload.id}`,
      });
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
