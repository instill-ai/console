import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function getUseRemainingCreditQueryKey(ownerName: Nullable<string>) {
  return ["credit", ownerName];
}

export function useRemainingCredit({
  ownerName,
  accessToken,
  enabled,
}: {
  ownerName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (ownerName && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseRemainingCreditQueryKey(ownerName);

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!ownerName) {
        return Promise.reject(new Error("ownerName not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const remainingCredit =
        await client.core.credit.getRemainingInstillCredit({
          ownerName,
        });

      return Promise.resolve(remainingCredit);
    },
    enabled: enabledQuery,
  });
}
