import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { undeployUserModeleAction } from "../../vdp-sdk";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useUndeployUserModel() {
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

      await undeployUserModeleAction({
        modelName,
        accessToken,
      });

      return Promise.resolve({ modelName, accessToken });
    },
    onSuccess: async ({ modelName }) => {
      await onSuccessAfterModelMutation({
        type: "deploy",
        queryClient,
        modelName,
      });
    },
  });
}
