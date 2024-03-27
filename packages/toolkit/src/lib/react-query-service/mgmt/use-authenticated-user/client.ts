"use client";

import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../../type";
import {
  fetchAuthenticatedUser,
  getUseAuthenticatedUserQueryKey,
} from "./server";

export function useAuthenticatedUser({
  accessToken,
  enabled,
  retry,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  const queryKey = getUseAuthenticatedUserQueryKey();
  return useQuery({
    queryKey,
    queryFn: async () => {
      return await fetchAuthenticatedUser({ accessToken });
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
