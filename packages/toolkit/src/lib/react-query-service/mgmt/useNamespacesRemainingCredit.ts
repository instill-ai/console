import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import {
  getRemainingCreditQuery,
  GetRemainingCreditResponse,
} from "../../vdp-sdk";

export type NamespaceRemainingCredit = {
  namespaceName: string;
  remainingCredit: GetRemainingCreditResponse;
};

export function useNamespacesRemainingCredit({
  namespaceNames,
  accessToken,
  enabled,
  retry,
}: {
  namespaceNames: string[];
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enabledQuery = false;

  if (namespaceNames.length !== 0 && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: ["namespaces-credit", namespaceNames.join(",")],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const remainingCredits: NamespaceRemainingCredit[] = [];

      for (const namespaceName of namespaceNames) {
        try {
          const remainingCredit = await getRemainingCreditQuery({
            ownerName: namespaceName,
            accessToken,
          });
          remainingCredits.push({
            namespaceName,
            remainingCredit,
          });
        } catch (error) {
          console.log(error);
        }
      }

      return Promise.resolve(remainingCredits);
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
    refetchOnWindowFocus: false,
  });
}
