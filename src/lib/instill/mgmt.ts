import axios from "axios";

export type User = {
  name: string;
  uid: string;
  email: string;
  id: string;
  company_name: string;
  role: string;
  usage_data_collection: boolean;
  newsletter_subscription: boolean;
  type: string;
  create_time: string;
  update_time: string;
};

export type GetUserResponse = {
  user: User;
};

export const getUserQuery = async (userName: string): Promise<User> => {
  try {
    const { data } = await axios.get<GetUserResponse>(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${userName}`
    );

    return Promise.resolve(data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};

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
