"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetNamespaceRemainingInstillCredit({
  namespaceId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespaceId && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey:
      queryKeyStore.mgmt.getUseGetNamespaceRemainingInstillCreditQueryKey({
        namespaceId,
      }),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const remainingCredit =
        await client.core.credit.getNamespaceRemainingInstillCredit({
          namespaceId,
        });

      return Promise.resolve(remainingCredit);
    },
    enabled: enabledQuery,
  });
}
