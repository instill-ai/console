import axios from "axios";

export type GetUserResponse = {
  user: {
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

export const getUserQuery = async (userId: string): Promise<User> => {
  try {
    const res = await axios.get<GetUserResponse>(
      `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/${userId}`
    );

    return Promise.resolve({
      id: res.data.user.id,
      companyName: res.data.user.company_name,
      role: res.data.user.role,
      usageDataCollection: res.data.user.usage_data_collection,
      newsletterSubscription: res.data.user.newsletter_subscription,
      type: res.data.user.type,
      createTime: res.data.user.create_time,
      updateTime: res.data.user.update_time,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
