"use client";

import type { CreateNamespaceModelRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../vdp-sdk";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useCreateNamespaceModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceModelRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      const model = await client.model.createNamespaceModel(payload);

      return Promise.resolve({
        model,
        accessToken,
        modelName: model.name,
      });
    },
    onSuccess: async ({ modelName }) => {
      await onSuccessAfterModelMutation({
        type: "create",
        queryClient,
        modelName,
      });
    },
  });
}
