"use client";

import type { Secret } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { getUseNamespaceSecretQueryKey } from "./use-namespace-secret/server";
import { getUseNamespaceSecretsQueryKey } from "./use-namespace-secrets/server";

export function useDeleteNamespaceSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      namespaceSecretName,
      accessToken,
    }: {
      namespaceSecretName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      await client.vdp.secret.deleteNamespaceSecret({
        namespaceSecretName,
      });

      return Promise.resolve(namespaceSecretName);
    },
    onSuccess: (secretName) => {
      const useNamespaceSecretQueryKey =
        getUseNamespaceSecretQueryKey(secretName);
      queryClient.removeQueries({
        queryKey: useNamespaceSecretQueryKey,
        exact: true,
      });

      const secretNameFragment = secretName.split("/");
      const entityName = `${secretNameFragment[0]}/${secretNameFragment[1]}`;

      const useNamespaceSecretsQueryKey =
        getUseNamespaceSecretsQueryKey(entityName);
      queryClient.setQueryData<Secret[]>(useNamespaceSecretsQueryKey, (old) => {
        return old ? old.filter((data) => data.name !== secretName) : [];
      });
    },
  });
}
