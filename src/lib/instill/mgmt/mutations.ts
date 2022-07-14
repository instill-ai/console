import axios from "axios";
import { User } from "./types";

export type UpdateUserResponse = {
  user: User;
};

export const updateLocalUserMutation = async (
  payload: Partial<User> & { email: string }
): Promise<User> => {
  try {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_MGMT_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`,
      payload
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
