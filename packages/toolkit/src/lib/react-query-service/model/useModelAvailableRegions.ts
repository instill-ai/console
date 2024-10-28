"use client";

import type { Nullable } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillModelAPIClient } from "../../vdp-sdk";
import { queryKeyStore } from "../queryKeyStore";

export function useModelAvailableRegions({
  accessToken,
  enabledQuery,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
}) {
  return useQuery({
    queryKey: queryKeyStore.model.getUseModelAvailableRegionsQueryKey(),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      const regions = await client.model.listAvailableRegion();

      return Promise.resolve(regions);
    },
    enabled: enabledQuery,
  });
}
