import { useQuery, useQueryClient } from "react-query";
import { getUserQuery, User } from "@/lib/instill";

export const useUser = () => {
  const queryClient = useQueryClient();
  return useQuery<User>(
    ["user", "local-user"],
    async () => {
      const user = await getUserQuery();
      return Promise.resolve(user);
    },
    {
      enabled: true,
      initialData: queryClient.getQueryData(["user", "local-user"]),
      retry: 3,
    }
  );
};
