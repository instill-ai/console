"use client";

import type { Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";
import { getUseOrganizationMembershipsQueryKey } from "./use-organization-memberships/server";
import { getUseUserMembershipsQueryKey } from "./useUserMemberships";

export function useDeleteOrganizationMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      organizationId,
      userId,
      accessToken,
    }: {
      organizationId: string;
      userId: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      await client.core.membership.deleteOrganizationMembership({
        organizationId,
        userId,
      });

      return Promise.resolve({ organizationId, userId });
    },
    onSuccess: ({ organizationId, userId }) => {
      const organizationMembershipsQueryKey =
        getUseOrganizationMembershipsQueryKey(organizationId);
      queryClient.invalidateQueries({
        queryKey: organizationMembershipsQueryKey,
      });
      const userMembershipsQueryKey = getUseUserMembershipsQueryKey(userId);
      queryClient.invalidateQueries({
        queryKey: userMembershipsQueryKey,
      });
    },
  });
}
