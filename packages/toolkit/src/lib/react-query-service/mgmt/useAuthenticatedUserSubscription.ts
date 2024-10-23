"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useAuthenticatedUserSubscription({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
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
  });
}
