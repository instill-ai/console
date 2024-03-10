import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthenticatedUser,
  updateAuthenticatedUserMutation,
  type User,
} from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useUpdateAuthenticatedUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: Partial<User>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const user = await updateAuthenticatedUserMutation({
        payload,
        accessToken,
      });

      return Promise.resolve(user);
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<AuthenticatedUser>(
        ["authenticated-user"],
        newUser
      );
    },
  });
}
