import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  CreateUserConnectorPayload,
  createUserConnectorMutation,
} from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export const useCreateUserConnector = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      userName,
      payload,
      accessToken,
    }: {
      userName: string;
      payload: CreateUserConnectorPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connector = await createUserConnectorMutation({
        userName,
        payload,
        accessToken,
      });

      return Promise.resolve({ connector, accessToken });
    },
    {
      onSuccess: async ({ connector, accessToken }) => {
        await onSuccessAfterConnectMutation({
          type: "create",
          queryClient,
          connector,
          accessToken,
        });
      },
    }
  );
};
