import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  CreateUserConnectorPayload,
  createUserConnectorMutation,
} from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export function useCreateUserConnector() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      entityName,
      payload,
      accessToken,
    }: {
      entityName: string;
      payload: CreateUserConnectorPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connector = await createUserConnectorMutation({
        entityName,
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
}
