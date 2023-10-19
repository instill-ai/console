import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  createUserConnectorResourceMutation,
  CreateUserConnectorResourcePayload,
} from "../../vdp-sdk";
import { onSuccessAfterConnectResourceMutation } from "./onSuccessAfterConnectResourceMutation";

export const useCreateUserConnectorResource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      userName,
      payload,
      accessToken,
    }: {
      userName: string;
      payload: CreateUserConnectorResourcePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorResource = await createUserConnectorResourceMutation({
        userName,
        payload,
        accessToken,
      });

      return Promise.resolve({ connectorResource, accessToken });
    },
    {
      onSuccess: async ({ connectorResource, accessToken }) => {
        await onSuccessAfterConnectResourceMutation({
          type: "create",
          queryClient,
          connectorResource,
          accessToken,
        });
      },
    }
  );
};
