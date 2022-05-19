import axios from "axios";

export type RawUser = {
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
  user: RawUser;
};

export type User = {
  id: string;
  companyName: string;
  role: string;
  usageDataCollection: boolean;
  newsletterSubscription: boolean;
  type: string;
  createTime: string;
  updateTime: string;
};

export const getUserQuery = async (userId: string): Promise<RawUser> => {
  try {
    const res = await axios.get<GetUserResponse>(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${userId}`
    );

    return Promise.resolve(res.data.user);
  } catch (err) {
    return Promise.reject(err);
  }
};
