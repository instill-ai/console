import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserMutation, type User } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({
      payload,
      accessToken,
    }: {
      payload: Partial<User>;
      accessToken: Nullable<string>;
    }) => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const user = await updateUserMutation({ payload, accessToken });

      return Promise.resolve(user);
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData<User>(["user", newUser.name], newUser);
      },
    }
  );
};
