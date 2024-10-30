"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchUser } from "./server";

export function useUser({
  userId,
  accessToken,
  enabled,
}: {
  userId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enabledQuery = false;

  if (enabled && userId) {
    enabledQuery = true;
  }

  return useQuery({
    queryKey: queryKeyStore.mgmt.getUseUserQueryKey({ userId }),
    queryFn: async () => {
      return await fetchUser({
        userId,
        accessToken,
      });
    },
    enabled: enabledQuery,
  });
}
