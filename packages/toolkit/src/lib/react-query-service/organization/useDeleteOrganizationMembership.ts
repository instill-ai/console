import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrganizationMembershipMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useDeleteOrganizationMembership() {
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

      await deleteOrganizationMembershipMutation({
        organizationID,
        userID,
        accessToken,
      });

      return Promise.resolve({ organizationID, userID });
    },
    onSuccess: ({ organizationID, userID }) => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationID, "memberships"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", userID, "memberships"],
      });
    },
  });
}
