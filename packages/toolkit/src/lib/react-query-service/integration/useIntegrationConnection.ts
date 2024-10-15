"use client";

import { useQuery } from "@tanstack/react-query";
import { Nullable, ResourceView } from "instill-sdk";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useIntegrationConnection({
  enabled,
  view = "VIEW_BASIC",
  connectionId,
  namespaceId,
  accessToken,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  view: ResourceView;
  connectionId: Nullable<string>;
  namespaceId: Nullable<string>;
}) {
  return useQuery({
    queryKey: ["integration-connection", connectionId, namespaceId, view],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!connectionId) {
        return Promise.reject(new Error("integrationId not provided"));
      }

      if (!namespaceId) {
        return Promise.reject(new Error("namespaceId not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const data = await client.core.integration.getIntegrationConnection({
        connectionId,
        namespaceId,
        view,
      });

      return Promise.resolve(data);
    },
    enabled: enabled,
  });
}
