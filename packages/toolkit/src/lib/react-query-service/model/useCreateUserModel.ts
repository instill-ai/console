import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserModelPayload, createUserModelMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useCreateUserModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entityName,
      isOrg,
      payload,
      accessToken,
    }: {
      entityName: string;
      isOrg: boolean;
      payload: CreateUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const model = await createUserModelMutation({
        entityName,
        isOrg,
        payload,
        accessToken,
      });

      return Promise.resolve({
        model,
        accessToken,
        modelName: `${entityName}/models/${payload.id}`,
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
