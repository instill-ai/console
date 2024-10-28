"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function useApiToken({
  tokenName,
  accessToken,
  enabled,
}: {
  tokenName: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["api-tokens", tokenName],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const token = await client.core.token.getApiToken({
        tokenName,
      });

      return Promise.resolve(token);
    },
    enabled,
  });
}
