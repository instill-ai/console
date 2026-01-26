"use client";

import type { Nullable, ResourceView } from "instill-sdk";
import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { queryKeyStore } from "../queryKeyStore";

export function useGetIntegration({
  enabled,
  view,
  integrationId,
  accessToken,
}: {
  integrationId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
  view: Nullable<ResourceView>;
}) {
  return useQuery({
    queryKey: queryKeyStore.integration.getUseGetIntegrationQueryKey({
      integrationId,
      view,
    }),
    queryFn: async () => {
      if (!integrationId) {
        return Promise.reject(new Error("integrationId is required"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const res = await client.mgmt.integration.getIntegration({
        integrationId,
        view: view ?? "VIEW_BASIC",
      });

      return Promise.resolve(res.integration);
    },
    enabled: enabled,
  });
}
