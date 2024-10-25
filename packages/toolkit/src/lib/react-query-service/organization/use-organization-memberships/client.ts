"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import {
  fetchOrganizationMemberships,
  getUseOrganizationMembershipsQueryKey,
} from "./server";

export function useOrganizationMemberships({
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

  const queryKey = getUseOrganizationMembershipsQueryKey(organizationId);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizationMemberships({
        organizationId,
        accessToken,
      });
    },
    enabled: enableQuery,
  });
}
