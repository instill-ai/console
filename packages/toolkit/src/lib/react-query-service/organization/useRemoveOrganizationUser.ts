import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrganizationMutation,
  Membership,
  Organization,
  removeOrganizationUserMutation,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useRemoveOrganizationUser = () => {
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

      await removeOrganizationUserMutation({
        organizationName,
        userName,
        accessToken,
      });

      return Promise.resolve(organizationName);
    },
    {
      onSuccess: (userName) => {
        queryClient.setQueryData<Membership[]>(["memberships"], (old) =>
          old ? old.filter((e) => e.user.name !== userName) : []
        );
      },
    }
  );
};
