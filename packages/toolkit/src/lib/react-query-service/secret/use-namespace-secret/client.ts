"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchNamespaceSecret } from "./server";

export function useNamespaceSecret({
  namespaceId,
  secretId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  secretId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespaceId && secretId && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.secret.getUseNamespaceSecretQueryKey({
      namespaceId,
      secretId,
    }),
    queryFn: async () => {
      try {
        return await fetchNamespaceSecret({
          namespaceId,
          secretId,
          accessToken,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    enabled: enabledQuery,
  });
}
