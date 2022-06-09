import { User, getUserQuery } from "@/lib/instill/mgmt";
import { useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";
import useUpdateUser from "./useUpdateUser";

const useTrackingToken = () => {
  const updateUser = useUpdateUser();

  return useQuery(["user", "tracking"], async () => {
    const user = await getUserQuery("users/local-user");

    if (user.cookie_token) {
      return Promise.resolve(user.cookie_token);
    }

    const newTrackingToken = uuidv4();

    const newUser = await updateUser.mutateAsync({
      name: "users/local-user",
      cookie_token: newTrackingToken,
    });

    return Promise.resolve(newUser.cookie_token as string);
  });
};

export default useTrackingToken;
