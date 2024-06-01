import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModelMutation, UpdateUserModelPayload } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useUpdateUserModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      payload,
      accessToken,
    }: {
      name: string;
      payload: UpdateUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const model = await updateModelMutation({ name, payload, accessToken });

      return Promise.resolve({ model, accessToken });
    },
    onSuccess: async ({ model }) => {
      await onSuccessAfterModelMutation({
        type: "update",
        queryClient,
        model,
      });
    },
  });
}
