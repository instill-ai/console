import { User } from "@/lib/instill/mgmt";
import { useQuery, useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";
import useUpdateUser from "./useUpdateUser";

const useTrackingToken = () => {
  const queryClient = useQueryClient();
  const updateUser = useUpdateUser();

  return useQuery(
    ["user", "tracking"],
    async () => {
      const user = queryClient.getQueryData<User>(["user"]);

      if (user) {
        if (user.cookie_token) {
          return Promise.resolve(user.cookie_token);
        }
      }

      const newTrackingToken = uuidv4();

      const newUser = await updateUser.mutateAsync({
        name: "users/local-user",
        cookie_token: newTrackingToken,
      });

      return Promise.resolve(newUser.cookie_token);
    },
    {
      onSuccess: (newUserTrackingToken) => {
        queryClient.setQueryData(["user", "tracking"], newUserTrackingToken);
      },
    }
  );
};

export default useTrackingToken;
