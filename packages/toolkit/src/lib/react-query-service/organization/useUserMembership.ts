"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function getUseUserMembershipQueryKey(
  userId: Nullable<string>,
  organizationId: Nullable<string>,
) {
  return ["users", userId, "memberships", organizationId];
}

export function useUserMembership({
  userId,
  organizationId,
  accessToken,
  enabled,
}: {
  userId: Nullable<string>;
  organizationId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (userId && enabled && organizationId) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: getUseUserMembershipQueryKey(userId, organizationId),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userId) {
        return Promise.reject(new Error("userId not provided"));
      }

      if (!organizationId) {
        return Promise.reject(new Error("organizationId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const membership = await client.core.membership.getUserMembership({
        userId,
        organizationId,
      });

      return Promise.resolve(membership);
    },
    enabled: enabledQuery,
  });
}
