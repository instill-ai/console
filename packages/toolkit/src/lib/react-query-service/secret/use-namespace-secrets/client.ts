"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespaceSecrets } from "./server";

export function useNamespaceSecrets({
  namespaceId,
  accessToken,
  enabled,
  pageSize,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  pageSize?: number;
}) {
  let enabledQuery = false;

  if (namespaceId && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.secret.getUseNamespaceSecretsQueryKey({
      namespaceId,
    }),
    queryFn: async () => {
      try {
        return await fetchNamespaceSecrets({
          namespaceId,
          accessToken,
          pageSize,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enabledQuery,
  });
}
