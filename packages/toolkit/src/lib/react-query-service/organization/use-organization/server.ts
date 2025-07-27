import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";

import { getInstillAPIClient } from "../../../sdk-helper";

export async function fetchOrganization({
  organizationId,
  accessToken,
}: {
  organizationId: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!organizationId) {
      return Promise.reject(new Error("organizationId not provided"));
    }

    if (!accessToken) {
      return Promise.reject(new Error("accessToken not provided"));
    }

    const client = getInstillAPIClient({
      accessToken,
    });

    const organization = await client.core.organization.getOrganization({
      organizationId,
    });

    return Promise.resolve(organization);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseOrganizationQueryKey(organizationId: Nullable<string>) {
  return ["organizations", organizationId];
}

export function prefetchOrganization({
  organizationId,
  accessToken,
  queryClient,
}: {
  organizationId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseOrganizationQueryKey(organizationId);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganization({
        organizationId,
        accessToken,
      });
    },
  });
}
