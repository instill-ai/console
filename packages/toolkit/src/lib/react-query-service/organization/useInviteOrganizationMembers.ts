"use client";

import type { InviteOrganizationMembersRequest, Nullable } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function useInviteOrganizationMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: InviteOrganizationMembersRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!payload.organizationId) {
        return Promise.reject(new Error("Organization name not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      await client.core.organization.inviteOrganizationMembers(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", variables.payload.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "organizations",
          variables.payload.organizationId,
          "memberships",
        ],
      });
    },
  });
}
