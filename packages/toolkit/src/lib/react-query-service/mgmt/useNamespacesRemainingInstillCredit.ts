"use client";

import type { GetRemainingInstillCreditResponse, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";

export type NamespaceRemainingInstillCredit = {
  namespaceName: string;
  remainingCredit: GetRemainingInstillCreditResponse;
};

export function getUseNamespacesRemainingInstillCreditQueryKey(
  namespaceNames: string[],
) {
  return ["namespaces-instill-credit", namespaceNames.join(",")];
}

export function useNamespacesRemainingInstillCredit({
  namespaceNames,
  accessToken,
  enabled,
}: {
  namespaceNames: string[];
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (namespaceNames.length !== 0 && enabled) {
    enabledQuery = true;
  }

  const queryKey =
    getUseNamespacesRemainingInstillCreditQueryKey(namespaceNames);

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const remainingInstillCredits: NamespaceRemainingInstillCredit[] = [];

      const client = getInstillAPIClient({ accessToken });

      for (const namespaceName of namespaceNames) {
        try {
          const remainingCredit =
            await client.core.credit.getRemainingInstillCredit({
              ownerName: namespaceName,
            });
          remainingInstillCredits.push({
            namespaceName,
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
