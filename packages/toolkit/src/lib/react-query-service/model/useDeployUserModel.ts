import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { deployUserModelAction } from "../../vdp-sdk";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export const useDeployUserModel = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      modelName,
      accessToken,
    }: {
      modelName: string;
      accessToken: Nullable<string>;
    }) => {
      try {
        if (!accessToken) {
          return Promise.reject(new Error("accessToken not provided"));
        }

        await deployUserModelAction({
          modelName,
          accessToken,
        });

        return Promise.resolve({ modelName, accessToken });
      } catch (err) {
        return Promise.reject(err);
      }
    },
    {
      onSuccess: async ({ modelName, accessToken }) => {
        await onSuccessAfterModelMutation({
          type: "deploy",
          queryClient,
          modelName,
          accessToken,
        });
      },
    }
  );
};
