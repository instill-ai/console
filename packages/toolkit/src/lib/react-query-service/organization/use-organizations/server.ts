import type { ListOrganizationsRequest, Nullable } from "instill-sdk";
import { QueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchOrganizations({
  accessToken,
  payload,
}: {
  accessToken: Nullable<string>;
  payload: ListOrganizationsRequest;
}) {
  try {
    if (!accessToken) {
      return Promise.reject(new Error("accessToken not provided"));
    }

    const client = getInstillAPIClient({
      accessToken,
    });

    const organization = await client.core.organization.listOrganizations({
      ...payload,
      enablePagination: false,
    });

    return Promise.resolve(organization);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseOrganizationsQueryKey() {
  return ["organizations"];
}

export function prefetchOrganizations({
  payload,
  accessToken,
  queryClient,
}: {
  payload: ListOrganizationsRequest;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseOrganizationsQueryKey();

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizations({
        payload,
        accessToken,
      });
    },
  });
}
