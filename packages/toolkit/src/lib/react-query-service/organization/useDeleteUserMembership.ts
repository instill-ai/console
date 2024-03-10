import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserMembershipMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useDeleteUserMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
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
    onSuccess: ({ userID, organizationID }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationID, "memberships"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", userID, "memberships"],
      });
    },
  });
}
