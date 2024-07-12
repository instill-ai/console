import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateAuthenticatedUserRequest } from "instill-sdk";

import type { Nullable } from "../../type";
import { AuthenticatedUser, getInstillAPIClient } from "../../vdp-sdk";

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

      const user = await client.core.user.updateAuthenticatedUser(payload);

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
