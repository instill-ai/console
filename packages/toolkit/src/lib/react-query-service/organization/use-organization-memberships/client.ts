"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import {
  fetchOrganizationMemberships,
  getUseOrganizationMembershipsQueryKey,
} from "./server";

export function useOrganizationMemberships({
  organizationID,
  accessToken,
  enabled,
  retry,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (organizationID && enabled) {
    enableQuery = true;
  }

  const queryKey = getUseOrganizationMembershipsQueryKey(organizationID);

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizationMemberships({
        organizationID,
        accessToken,
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
