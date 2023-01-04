import { env } from "@/utils/config";
import axios from "axios";
import { User } from "./types";

export type UpdateUserResponse = {
  user: User;
};

export const updateLocalUserMutation = async (
  payload: Partial<User>
): Promise<User> => {
  try {
    const { data } = await axios.patch(
      `${env("NEXT_PUBLIC_MGMT_BACKEND_BASE_URL")}/${env(
        "NEXT_PUBLIC_API_VERSION"
      )}/users/local-user`,
      payload
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
