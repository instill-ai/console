import { env } from "@/utils";
import { createInstillAxiosClient } from "../helper";
import { User } from "./types";

export type UpdateUserResponse = {
  user: User;
};

export const updateLocalUserMutation = async (
  payload: Partial<User>
): Promise<User> => {
  try {
    const client = createInstillAxiosClient();

    const { data } = await client.patch(
      `${env("NEXT_PUBLIC_API_VERSION")}/users/me`,
      payload
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
