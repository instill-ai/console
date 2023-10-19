import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Nullable } from "../../type";
import {
  ConnectorResourceWithDefinition,
  deleteUserConnectorResourceMutation,
} from "../../vdp-sdk";
import { onSuccessAfterConnectResourceMutation } from "./onSuccessAfterConnectResourceMutation";

export const useDeleteUserConnectorResource = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      accessToken,
      connectorResourceName,
    }: {
      accessToken: Nullable<string>;
      connectorResourceName: string;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connectorResource =
        queryClient.getQueryData<ConnectorResourceWithDefinition>([
          "connector-resources",
          connectorResourceName,
        ]);

      await deleteUserConnectorResourceMutation({
        connectorResourceName,
        accessToken,
      });
      return Promise.resolve({
        connectorResourceName,
        connectorResource,
        accessToken,
      });
    },
    {
      onSuccess: async ({
        connectorResourceName,
        connectorResource,
        accessToken,
      }) => {
        await onSuccessAfterConnectResourceMutation({
          type: "delete",
          queryClient,
          connectorResourceName,
          connectorResource,
          accessToken,
        });
      },
    }
  );
};
