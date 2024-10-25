"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchOrganization, getUseOrganizationQueryKey } from "./server";

export function useOrganization({
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

  const queryKey = getUseOrganizationQueryKey(organizationId);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganization({
        organizationId,
        accessToken,
      });
    },
    enabled: enableQuery,
  });
}
