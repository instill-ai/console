"use client";

import type { CreateNamespaceSecretRequest, Secret } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import {
  getUseNamespaceSecretQueryKey,
  getUseNamespaceSecretsQueryKey,
} from "../../../server";
import { getInstillAPIClient } from "../../sdk-helper";

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

      const secret = await client.vdp.secret.createNamespaceSecret(payload);

      return Promise.resolve({ secret, namespaceName: payload.namespaceName });
    },
    onSuccess: async ({ secret, namespaceName }) => {
      const useUserSecretQueryKey = getUseNamespaceSecretQueryKey(secret.name);
      queryClient.setQueryData<Secret>(useUserSecretQueryKey, secret);

      const useUserSecretsQueryKey =
        getUseNamespaceSecretsQueryKey(namespaceName);
      queryClient.setQueryData<Secret[]>(useUserSecretsQueryKey, (old) =>
        old ? [secret, ...old] : [secret],
      );
    },
  });
}
