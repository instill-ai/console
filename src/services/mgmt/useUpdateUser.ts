import { useMutation, useQueryClient } from "react-query";
import { updateLocalUserMutation, User } from "@/lib/instill";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: Partial<User>) => {
      const user = await updateLocalUserMutation(payload);
      return Promise.resolve(user);
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData<User>(["user", newUser.id], newUser);
      },
    }
  );
};
