import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Membership, removeOrganizationUserMutation } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useRemoveOrganizationUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      organizationName,
      userName,
      accessToken,
    }: {
      organizationName: Nullable<string>;
      userName: Nullable<string>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!organizationName) {
        return Promise.reject(new Error("Organization name not provided"));
      }
      if (!userName) {
        return Promise.reject(new Error("User name not provided"));
      }

      await removeOrganizationUserMutation({
        organizationName,
        userName,
        accessToken,
      });

      return Promise.resolve(organizationName);
    },
    {
      onSuccess: (data, { organizationName, userName }) => {
        queryClient.setQueryData<Membership[]>(
          ["organizations", organizationName, "memberships"],
          (old) => (old ? old.filter((e) => e.user.name !== userName) : [])
        );
      },
    }
  );
};
