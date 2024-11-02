"use client";

import type {
  GetNamespaceRemainingInstillCreditResponse,
  Nullable,
} from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export type NamespaceRemainingInstillCredit = {
  namespaceId: string;
  remainingCredit: GetNamespaceRemainingInstillCreditResponse;
};

export function useListNamespacesRemainingInstillCredit({
  namespaceIds,
  accessToken,
  enabled,
}: {
  namespaceIds: string[];
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespaceIds.length !== 0 && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey:
      queryKeyStore.mgmt.getUseListNamespacesRemainingInstillCreditQueryKey({
        namespaceIds,
      }),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const remainingInstillCredits: NamespaceRemainingInstillCredit[] = [];

      const client = getInstillAPIClient({ accessToken });

      for (const namespaceId of namespaceIds) {
        try {
          const remainingCredit =
            await client.core.credit.getNamespaceRemainingInstillCredit({
              namespaceId,
            });

          remainingInstillCredits.push({
            namespaceId,
            remainingCredit,
          });
        } catch (error) {
          console.log(error);
        }
      }

      return Promise.resolve(remainingInstillCredits);
    },
    enabled: enabledQuery,
    refetchOnWindowFocus: false,
  });
}
