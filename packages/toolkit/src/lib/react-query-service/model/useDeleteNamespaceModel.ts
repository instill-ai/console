"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../vdp-sdk";
import { onSuccessAfterModelMutation } from "./onSuccessAfterModelMutation";

export function useDeleteNamespaceModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      namespaceId,
      modelId,
      accessToken,
    }: {
      namespaceId: string;
      modelId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      await client.model.deleteNamespaceModel({ namespaceId, modelId });

      return Promise.resolve({ namespaceId, modelId, accessToken });
    },
    onSuccess: async ({ namespaceId, modelId }) => {
      await onSuccessAfterModelMutation({
        type: "create",
        queryClient,
        modelName: `/namespaces/${namespaceId}/models/${modelId}`,
      });
    },
  });
}
