"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function getUseOrganizationSubscriptionQueryKey(
  organizationId: Nullable<string>,
) {
  return ["organizations", organizationId, "subscription"];
}

export function useOrganizationSubscription({
  organizationId,
  accessToken,
  enabled,
}: {
  organizationId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (organizationId && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: getUseOrganizationSubscriptionQueryKey(organizationId),
    queryFn: async () => {
      if (!organizationId) {
        return Promise.reject(new Error("organizationId not provided"));
      }

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const subscription =
        await client.core.subscription.getOrganizationSubscription({
          organizationId,
        });

      return Promise.resolve(subscription);
    },
    enabled: enableQuery,
  });
}
