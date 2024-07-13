import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient, GetRemainingCreditResponse } from "../../vdp-sdk";

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

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      for (const namespaceName of namespaceNames) {
        try {
          const remainingCredit =
            await client.core.credit.getRemainingInstillCredit({
              ownerName: namespaceName,
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
