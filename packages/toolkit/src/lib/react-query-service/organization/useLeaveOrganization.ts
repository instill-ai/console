import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Membership, leaveOrganizationMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useLeaveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationName,
      userName,
      accessToken,
    }: {
      organizationName: string;
      userName: string;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      await leaveOrganizationMutation({
        organizationName,
        userName,
        accessToken,
      });

      return Promise.resolve(organizationName);
    },
    {
      onSuccess: (data, { organizationName, userName }) => {
        queryClient.setQueryData<Membership[]>(
          ["organizations", organizationName, "memberships", userName],
          (old) => (old ? old.filter((e) => e.user.name !== userName) : [])
        );
      },
    }
  );
};
