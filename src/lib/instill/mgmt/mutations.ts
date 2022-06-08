import axios from "axios";
import { User } from "./types";

export type UpdateUserResponse = {
  user: User;
};

export const updateLocalUserMutation = async (
  user: Partial<User>
): Promise<User> => {
  try {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`,
      {
        email: user.email,
        company_name: user.company_name,
        role: user.role,
        usage_data_collection: user.usage_data_collection,
        newsletter_subscription: user.newsletter_subscription,
      }
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
