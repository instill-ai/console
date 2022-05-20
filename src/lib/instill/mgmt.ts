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
  name: string;
  email: string;
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
    const res = await axios.post<GetUserResponse>("/api/mgmt/get-user", {
      id: userId,
    });

    const user: User = {
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      companyName: res.data.user.company_name,
      role: res.data.user.role,
      usageDataCollection: res.data.user.usage_data_collection,
      newsletterSubscription: res.data.user.newsletter_subscription,
      type: res.data.user.type,
      createTime: res.data.user.create_time,
      updateTime: res.data.user.update_time,
    };

    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UpdateUserResponse = {
  user: RawUser;
};

export const updateUserMutation = async (
  data: Partial<User>
): Promise<User> => {
  try {
    const res = await axios.post<UpdateUserResponse>(
      "/api/submit-onboarded-form",
      {
        email: data.email,
        company_name: data.companyName,
        role: data.role,
        usage_data_collection: data.usageDataCollection,
        newsletter_subscription: data.newsletterSubscription,
      }
    );

    const user: User = {
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      companyName: res.data.user.company_name,
      role: res.data.user.role,
      usageDataCollection: res.data.user.usage_data_collection,
      newsletterSubscription: res.data.user.newsletter_subscription,
      type: res.data.user.type,
      createTime: res.data.user.create_time,
      updateTime: res.data.user.update_time,
    };

    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
