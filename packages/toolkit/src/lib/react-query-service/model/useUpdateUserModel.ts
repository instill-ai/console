import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModelMutation, UpdateUserModelPayload } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useUpdateUserModel() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: UpdateUserModelPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const model = await updateModelMutation({ payload, accessToken });

      return Promise.resolve({ model, accessToken });
    },
    {
      onSuccess: async ({ model, accessToken }) => {
        await onSuccessAfterModelMutation({
          type: "update",
          queryClient,
          model,
          accessToken,
        });
      },
    }
  );
}
