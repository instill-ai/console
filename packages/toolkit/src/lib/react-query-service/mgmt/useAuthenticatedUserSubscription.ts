import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useAuthenticatedUserSubscription({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["authenticated-user", "subscription"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const subscription =
        await client.core.subscription.getAuthenticatedUserSubscription();

      return Promise.resolve(subscription);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
