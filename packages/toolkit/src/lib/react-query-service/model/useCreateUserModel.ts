import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserModelPayload, createUserModelMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useCreateUserModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entityName,
      payload,
      accessToken,
    }: {
      entityName: string;
      payload: CreateUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const model = await createUserModelMutation({
        entityName,
        payload,
        accessToken,
      });

      return Promise.resolve({
        model,
        accessToken,
        modelName: model.name,
      });
    },
    onSuccess: async ({ modelName }) => {
      await onSuccessAfterModelMutation({
        type: "create",
        queryClient,
        modelName,
      });
    },
  });
}
