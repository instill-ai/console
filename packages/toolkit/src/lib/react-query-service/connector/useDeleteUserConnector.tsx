import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "../../type";
import {
  ConnectorWithDefinition,
  deleteUserConnectorMutation,
} from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export function useDeleteUserConnector() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      accessToken,
      connectorName,
    }: {
      accessToken: Nullable<string>;
      connectorName: string;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connector = queryClient.getQueryData<ConnectorWithDefinition>([
        "connectors",
        connectorName,
      ]);

      await deleteUserConnectorMutation({
        connectorName,
        accessToken,
      });
      return Promise.resolve({
        connectorName,
        connector,
        accessToken,
      });
    },
    {
      onSuccess: async ({ connectorName, connector, accessToken }) => {
        await onSuccessAfterConnectMutation({
          type: "delete",
          queryClient,
          connectorName,
          connector,
          accessToken,
        });
      },
    }
  );
}
