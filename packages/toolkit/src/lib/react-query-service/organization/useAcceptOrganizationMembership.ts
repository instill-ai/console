import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  AcceptOrganizationMembershipPayload,
  Membership,
  acceptOrganizationMembershipAction,
} from "../../vdp-sdk";

export const useAcceptOrganizationMembership = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: AcceptOrganizationMembershipPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      const membership = await acceptOrganizationMembershipAction({
        payload,
        accessToken,
      });

      return Promise.resolve({ membership });
    },
    {
      onSuccess: ({ membership }) => {
        queryClient.setQueryData<Membership[]>(
          [
            "organizations",
            membership.organization.org_name,
            "memberships",
            membership.user.name,
          ],
          (old) =>
            old
              ? [
                  ...old.filter((e) => e.user.name !== membership.user.name),
                  membership,
                ]
              : [membership]
        );
      },
    }
  );
};
