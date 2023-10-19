import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserConnectorResourceMutation,
  UpdateUserConnectorResourcePayload,
} from "../../vdp-sdk";
import { Nullable } from "../../type";
import { onSuccessAfterConnectResourceMutation } from "./onSuccessAfterConnectResourceMutation";

export const useUpdateUserConnectorResource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: UpdateUserConnectorResourcePayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorResource = await updateUserConnectorResourceMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ connectorResource, accessToken });
    },
    {
      onSuccess: async ({ connectorResource, accessToken }) => {
        await onSuccessAfterConnectResourceMutation({
          type: "update",
          queryClient,
          connectorResource,
          accessToken,
        });
      },
    }
  );
};
