"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";

export function getUseOrganizationMembershipQueryKey(
  organizationId: Nullable<string>,
  userId: Nullable<string>,
) {
  return ["organizations", organizationId, "memberships", userId];
}

export function useOrganizationMembership({
  organizationId,
  userId,
  accessToken,
  enabled,
}: {
  organizationId: Nullable<string>;
  userId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (organizationId && userId && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: getUseOrganizationMembershipQueryKey(organizationId, userId),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("Access Token not provided"));
      }

      if (!organizationId) {
        return Promise.reject(new Error("organizationId not provided"));
      }

      if (!userId) {
        return Promise.reject(new Error("userId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const membership = await client.core.membership.getOrganizationMembership(
        {
          organizationId,
          userId,
        },
      );

      return Promise.resolve(membership);
    },
    enabled: enabledQuery,
  });
}
