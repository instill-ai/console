"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable, ResourceView } from "instill-sdk";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useIntegration({
  enabled,
  retry,
  view = "VIEW_BASIC",
  integrationId,
  accessToken,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  view: ResourceView;
  integrationId: string;
}) {
  return useQuery({
    queryKey: ["integration", integrationId, view],
    queryFn: async () => {
      if (!integrationId) {
        return Promise.reject(new Error("integrationId not provided"));
      }

      const client = getInstillAPIClient({
        accessToken: accessToken ?? undefined,
      });

      const data = await client.core.integration.getIntegration({
        integrationId,
        view,
      });

      return Promise.resolve(data);
    },
    enabled: enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
