"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";

export function getUseUserMembershipsQueryKey(userId: Nullable<string>) {
  return ["users", userId, "memberships"];
}

export function useUserMemberships({
  userId,
  accessToken,
  enabled,
}: {
  userId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (userId && enabled) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: getUseUserMembershipsQueryKey(userId),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!userId) {
        return Promise.reject(new Error("userId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const memberships = await client.core.membership.listUserMemberships({
        userId,
      });

      return Promise.resolve(memberships);
    },
    enabled: enabledQuery,
  });
}
