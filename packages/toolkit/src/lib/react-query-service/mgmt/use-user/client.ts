"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import { fetchUser, getUseUserQueryKey } from "./server";

export function useUser({
  userName,
  accessToken,
  enabled,
  retry,
}: {
  userName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enabledQuery = false;

  if (enabled && userName) {
    enabledQuery = true;
  }

  const queryKey = getUseUserQueryKey(userName);

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return await fetchUser({
        userName,
        accessToken,
      });
    },
    enabled: enabledQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
