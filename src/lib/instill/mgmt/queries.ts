import { env } from "@/utils/config";
import axios from "axios";
import { User } from "./types";

export type GetUserResponse = {
  user: User;
};

export const getUserQuery = async (userName: string): Promise<User> => {
  try {
    const { data } = await axios.get<GetUserResponse>(
      `${env("NEXT_PUBLIC_MGMT_BACKEND_BASE_URL")}/${env(
        "NEXT_PUBLIC_API_VERSION"
      )}/${userName}`
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
