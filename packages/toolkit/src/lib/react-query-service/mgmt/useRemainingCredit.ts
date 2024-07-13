import { useQuery } from "@tanstack/react-query";

import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useRemainingCredit({
  ownerName,
  accessToken,
  enabled,
  retry,
}: {
  ownerName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enabledQuery = false;

  if (ownerName && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: ["credit", ownerName],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!ownerName) {
        return Promise.reject(new Error("ownerName not provided"));
      }

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      const remainingCredit =
        await client.core.credit.getRemainingInstillCredit({
          ownerName,
        });

      return Promise.resolve(remainingCredit);
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
