"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { queryKeyStore } from "../../queryKeyStore";
import { fetchAPITokens } from "./server";

export function useAPITokens({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.mgmt.getUseAPITokensQueryKey(),
    queryFn: async () => {
      return await fetchAPITokens({
        accessToken,
      });
    },
    enabled,
  });
}
