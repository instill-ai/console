import type { Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../sdk-helper";

export async function fetchOrganizationMemberships({
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

    const membership = await client.core.membership.listOrganizationMemberships(
      {
        organizationId,
      },
    );

    return Promise.resolve(membership);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseOrganizationMembershipsQueryKey(
  organizationId: Nullable<string>,
) {
  return ["organizations", organizationId, "memberships"];
}

export function prefetchOrganizationMemberships({
  organizationId,
  accessToken,
  queryClient,
}: {
  organizationId: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseOrganizationMembershipsQueryKey(organizationId);
  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizationMemberships({
        organizationId,
        accessToken,
      });
    },
  });
}
