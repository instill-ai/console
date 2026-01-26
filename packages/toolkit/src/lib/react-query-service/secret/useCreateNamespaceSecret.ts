"use client";

import type { CreateNamespaceSecretRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useCreateNamespaceSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: CreateNamespaceSecretRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.pipeline.secret.createNamespaceSecret(payload);

      return Promise.resolve({
        namespaceId: payload.namespaceId,
      });
    },
    onSuccess: async ({ namespaceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyStore.secret.getUseNamespaceSecretsQueryKey({
          namespaceId,
        }),
      });
    },
  });
}
