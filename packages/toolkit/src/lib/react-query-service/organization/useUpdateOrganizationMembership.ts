"use client";

import type {
  Nullable,
  UpdateOrganizationMembershipRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";
import { getUseOrganizationMembershipsQueryKey } from "./use-organization-memberships/server";
import { getUseUserMembershipsQueryKey } from "./useUserMemberships";

export function useUpdateOrganizationMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateOrganizationMembershipRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!payload.organizationId) {
        return Promise.reject(new Error("Organization ID not provided"));
      }

      if (!payload.userId) {
        return Promise.reject(new Error("User ID not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const membership =
        await client.core.membership.updateOrganizationMembership(payload);

      return Promise.resolve({ membership });
    },
    onSuccess: ({ membership }) => {
      const organizationMembershipsQueryKey =
        getUseOrganizationMembershipsQueryKey(membership.organization.id);
      queryClient.invalidateQueries({
        queryKey: organizationMembershipsQueryKey,
      });
      const userMembershipsQueryKey = getUseUserMembershipsQueryKey(
        membership.user.id,
      );
      queryClient.invalidateQueries({
        queryKey: userMembershipsQueryKey,
      });
    },
  });
}
