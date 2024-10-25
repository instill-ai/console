"use client";

import type { Nullable, UpdateUserMembershipRequest } from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../vdp-sdk";

export function useUpdateUserMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateUserMembershipRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!payload.organizationId) {
        return Promise.reject(new Error("Organization name not provided"));
      }

      if (!payload.userId) {
        return Promise.reject(new Error("User name not provided"));
      }

      const client = getInstillAPIClient({
        accessToken,
      });

      const membership =
        await client.core.membership.updateUserMembership(payload);

      return Promise.resolve({ membership });
    },
    onSuccess: ({ membership }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", membership.organization.id, "memberships"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", membership.user.id, "memberships"],
      });
    },
  });
}
