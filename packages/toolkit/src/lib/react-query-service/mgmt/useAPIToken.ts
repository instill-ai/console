"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useAPIToken({
  tokenId,
  accessToken,
  enabled,
}: {
  tokenId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.mgmt.getUseAPITokenQueryKey({ tokenId }),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken is required"));
      }

      const client = getInstillAPIClient({ accessToken });

      const res = await client.core.token.getAPIToken({
        tokenId,
      });

      return Promise.resolve(res.token);
    },
    enabled,
  });
}
