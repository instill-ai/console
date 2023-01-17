import { useQuery, useQueryClient } from "react-query";
import { getUserQuery, User } from "@/lib/instill";
import { Nullable } from "@/types/general";

export const useUser = (userName: Nullable<string>) => {
  const queryClient = useQueryClient();
  return useQuery<User>(
    ["user", userName],
    async () => {
      if (!userName) {
        return Promise.reject(new Error("invalid user name"));
      }

      const user = await getUserQuery(userName);

      return Promise.resolve(user);
    },
    {
      enabled: !!userName,
      initialData: queryClient.getQueryData(["user", userName]),
      retry: 3,
    }
  );
};
