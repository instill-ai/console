export type OnboardingStatus =
  | "ONBOARDING_STATUS_UNSPECIFIED"
  | "ONBOARDING_STATUS_IN_PROGRESS"
  | "ONBOARDING_STATUS_COMPLETED";

export type UserProfile = {
  displayName?: string;
  bio?: string;
  publicEmail?: string;
  companyName?: string;
  avatar?: string;
  socialProfilesLinks?: {
    webiste?: string;
    x?: string;
    github?: string;
  };
};

export type User = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  profile?: UserProfile;
};

export type AuthenticatedUser = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  customerId: string;
  email: string;
  newsletterSubscription: boolean;
  role: string;
  onboardingStatus: OnboardingStatus;
  cookieToken?: string;
  profile?: UserProfile;
};

export type GetAuthenticatedResponse = {
  user: AuthenticatedUser;
};

export type UpdateAuthenticatedUserRequest = Partial<
  Omit<AuthenticatedUser, "uid" | "createTime" | "updateTime" | "customerId">
>;

export type UpdateAuthenticatedUserResponse = {
  user: AuthenticatedUser;
};

export type ListUsersRequest = {
  pageSize?: number;
  pageToken?: string;
};

export type ListUsersResponse = {
  users: User[];
  nextPageToken: string;
  totalSize: number;
};

export type GetUserRequest = {
  userName: string;
};

export type GetUserResponse = {
  user: User;
};
