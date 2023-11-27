import type { Nullable } from "../../type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectUserConnectorAction } from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export const useConnectConnector = () => {
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

      const connector = await connectUserConnectorAction({
        connectorName,
        accessToken,
      });

      return Promise.resolve({ connector, accessToken });
    },
    {
      onSuccess: async ({ connector, accessToken }) => {
        await onSuccessAfterConnectMutation({
          type: "connect",
          queryClient,
          connector,
          accessToken,
        });
      },
    }
  );
};
