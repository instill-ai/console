import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getOrganizationQuery } from "../../../vdp-sdk";

export async function fetchOrganization({
  organizationID,
  accessToken,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    if (!organizationID) {
      return Promise.reject(new Error("organizationID not provided"));
    }

    const organization = await getOrganizationQuery({
      organizationID,
      accessToken,
    });

    return Promise.resolve(organization);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseOrganizationQueryKey(organizationID: Nullable<string>) {
  return ["organization", organizationID];
}

export function prefetchOrganization({
  organizationID,
  accessToken,
  queryClient,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseOrganizationQueryKey(organizationID);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganization({
        organizationID,
        accessToken,
      });
    },
  });
}
