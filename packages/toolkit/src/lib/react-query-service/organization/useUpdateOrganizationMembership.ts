import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  OrganizationMembership,
  UpdateOrganizationMembershipPayload,
  updateOrganizationMembershipMutation,
} from "../../vdp-sdk";

export const useUpdateOrganizationMembership = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: UpdateOrganizationMembershipPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const membership = await updateOrganizationMembershipMutation({
        payload,
        accessToken,
      });

      return Promise.resolve({ membership });
    },
    {
      onSuccess: ({ membership }) => {
        queryClient.invalidateQueries([
          "organizations",
          membership.organization.id,
          "memberships",
        ]);
        queryClient.invalidateQueries([
          "users",
          membership.user.id,
          "memberships",
        ]);
      },
    }
  );
};
