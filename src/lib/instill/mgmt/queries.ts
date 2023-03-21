import { env } from "@/utils";
import { createInstillAxiosClient } from "../helper";
import { User } from "./types";

export type GetUserResponse = {
  user: User;
};

export const getUserQuery = async (): Promise<User> => {
  try {
    const client = createInstillAxiosClient();

    const { data } = await client.get<GetUserResponse>(
      `${env("NEXT_PUBLIC_API_VERSION")}/users/me`
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
