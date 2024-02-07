import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  UpdateUserMembershipPayload,
  updateUserMembershipMutation,
} from "../../vdp-sdk";

export function useUpdateUserMembership() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: UpdateUserMembershipPayload;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("AccessToken not provided"));
      }

      if (!payload.organizationID) {
        return Promise.reject(new Error("Organization name not provided"));
      }
      if (!payload.userID) {
        return Promise.reject(new Error("User name not provided"));
      }

      const membership = await updateUserMembershipMutation({
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
}
