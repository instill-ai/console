"use client";

import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";
import { Nullable } from "../../../type";
import { getUseApiTokensQueryKey } from "./server";

export function useApiTokens({
  accessToken,
  enabled,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  const queryKey = getUseApiTokensQueryKey();
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const tokens = await client.core.token.listAPITokens({
        enablePagination: false,
      });

      return Promise.resolve(tokens);
    },
    enabled,
  });
}
