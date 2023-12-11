import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OrganizationMembership,
  deleteOrganizationMembershipMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteOrganizationMembership = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationID,
      userID,
      accessToken,
    }: {
      organizationID: string;
      userID: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      await deleteOrganizationMembershipMutation({
        organizationID,
        userID,
        accessToken,
      });

      return Promise.resolve({ organizationID, userID });
    },
    {
      onSuccess: ({ organizationID, userID }) => {
        queryClient.setQueryData<OrganizationMembership[]>(
          ["organizations", organizationID, "memberships"],
          (old) => (old ? old.filter((e) => e.user.id !== userID) : [])
        );
      },
    }
  );
};
