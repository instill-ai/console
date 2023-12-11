import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import {
  UpdateUserMembershipPayload,
  UserMembership,
  updateUserMembershipMutation,
} from "../../vdp-sdk";

export const useUpdateUserMembership = () => {
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

      return Promise.resolve({ membership, userID: payload.userID });
    },
    {
      onSuccess: ({ membership, userID }) => {
        queryClient.setQueryData<UserMembership[]>(
          ["users", userID, "memberships"],
          (old) =>
            old
              ? [...old.filter((e) => e.user.id !== userID), membership]
              : [membership]
        );
      },
    }
  );
};
