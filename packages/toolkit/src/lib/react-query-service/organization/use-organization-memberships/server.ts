import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getOrganizationMembershipsQuery } from "../../../vdp-sdk";

export async function fetchOrganizationMemberships({
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

    const membership = await getOrganizationMembershipsQuery({
      organizationID,
      accessToken,
    });

    return Promise.resolve(membership);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseOrganizationMembershipsQueryKey(
  organizationID: Nullable<string>
) {
  return ["organizations", organizationID, "memberships"];
}

export function prefetchOrganizationMemberships({
  organizationID,
  accessToken,
  queryClient,
}: {
  organizationID: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
}) {
  const queryKey = getUseOrganizationMembershipsQueryKey(organizationID);
  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchOrganizationMemberships({
        organizationID,
        accessToken,
      });
    },
  });
}
