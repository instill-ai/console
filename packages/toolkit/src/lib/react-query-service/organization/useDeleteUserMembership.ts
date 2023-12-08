import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OrganizationMembership,
  deleteUserMembershipMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useDeleteUserMembership = () => {
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

      await deleteUserMembershipMutation({
        organizationID,
        userID,
        accessToken,
      });

      return Promise.resolve({ organizationID, userID });
    },
    {
      onSuccess: ({ userID }) => {
        queryClient.setQueryData<OrganizationMembership[]>(
          ["users", userID, "memberships"],
          (old) => (old ? old.filter((e) => e.user.id !== userID) : [])
        );
      },
    }
  );
};
