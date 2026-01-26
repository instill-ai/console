"use client";

import type {
  AuthenticatedUser,
  Nullable,
  UpdateAuthenticatedUserRequest,
} from "instill-sdk";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export function useUpdateAuthenticatedUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      payload,
      accessToken,
    }: {
      payload: UpdateAuthenticatedUserRequest;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const user = await client.mgmt.user.updateAuthenticatedUser(payload);

      return Promise.resolve(user);
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData<AuthenticatedUser>(
        ["authenticated-user"],
        newUser,
      );
    },
  });
}
