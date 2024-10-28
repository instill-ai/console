"use client";

import type { Nullable, UpdateNamespaceModelRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../sdk-helper";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useUpdateNamespaceModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateNamespaceModelRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      const model = await client.model.updateNamespaceModel(payload);

      return Promise.resolve({ model, accessToken });
    },
    onSuccess: async ({ model }) => {
      await onSuccessAfterModelMutation({
        type: "update",
        queryClient,
        model,
      });
    },
  });
}
