import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nullable } from "../../type";
import {
  UpdateUserConnectorPayload,
  updateUserConnectorMutation,
} from "../../vdp-sdk";
import { onSuccessAfterConnectMutation } from "./onSuccessAfterConnectMutation";

export function useUpdateUserConnector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateUserConnectorPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const connector = await updateUserConnectorMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ connector, accessToken });
    },
    onSuccess: async ({ connector, accessToken }) => {
      await onSuccessAfterConnectMutation({
        type: "update",
        queryClient,
        connector,
        accessToken,
      });
    },
  });
}
