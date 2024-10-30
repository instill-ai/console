"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useDeleteNamespaceSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      namespaceId,
      secretId,
      accessToken,
    }: {
      namespaceId: string;
      secretId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.vdp.secret.deleteNamespaceSecret({
        namespaceId,
        secretId,
      });

      return Promise.resolve({ namespaceId, secretId });
    },
    onSuccess: ({ namespaceId, secretId }) => {
      queryClient.removeQueries({
        queryKey: queryKeyStore.secret.getUseNamespaceSecretQueryKey({
          namespaceId,
          secretId,
        }),
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeyStore.secret.getUseNamespaceSecretsQueryKey({
          namespaceId,
        }),
      });
    },
  });
}
