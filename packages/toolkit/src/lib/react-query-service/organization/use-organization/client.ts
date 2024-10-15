"use client";

import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../../type";
import { fetchOrganization, getUseOrganizationQueryKey } from "./server";

export function useOrganization({
  organizationID,
  accessToken,
  enabled,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (organizationID && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseOrganizationQueryKey(organizationID);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganization({
        organizationID,
        accessToken,
      });
    },
    enabled: enableQuery,
  });
}
