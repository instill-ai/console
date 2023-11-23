import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { disconnectUserConnectorAction } from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export const useDisonnectUserConnector = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      connectorName,
      accessToken,
    }: {
      connectorName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connector = await disconnectUserConnectorAction({
        connectorName,
        accessToken,
      });

      return Promise.resolve({ connector, accessToken });
    },
    {
      onSuccess: async ({ connector, accessToken }) => {
        await onSuccessAfterConnectMutation({
          type: "disconnect",
          queryClient,
          connector,
          accessToken,
        });
      },
    }
  );
};
