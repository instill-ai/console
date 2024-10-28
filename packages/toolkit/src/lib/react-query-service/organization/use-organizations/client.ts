"use client";

import type { ListOrganizationsRequest, Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { fetchOrganizations, getUseOrganizationsQueryKey } from "./server";

export function useOrganizations({
  accessToken,
  payload,
  enabled,
}: {
  accessToken: Nullable<string>;
  payload: ListOrganizationsRequest;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (accessToken && enabled) {
    enabledQuery = true;
  }

  const queryKey = getUseOrganizationsQueryKey();

  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizations({
        accessToken,
        payload,
      });
    },
    enabled: enabledQuery,
  });
}
