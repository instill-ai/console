import { z } from "zod";

import { ResourceView } from "../../vdp";

export type OnboardingStatus =
  | "ONBOARDING_STATUS_UNSPECIFIED"
  | "ONBOARDING_STATUS_IN_PROGRESS"
  | "ONBOARDING_STATUS_COMPLETED";

export const OnboardingStatusSchema = z.enum([
  "ONBOARDING_STATUS_UNSPECIFIED",
  "ONBOARDING_STATUS_IN_PROGRESS",
  "ONBOARDING_STATUS_COMPLETED",
]);

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

export const UserProfileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  publicEmail: z.string().optional(),
  companyName: z.string().optional(),
  avatar: z.string().optional(),
  socialProfilesLinks: z
    .object({
      webiste: z.string().optional(),
      x: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});

export type User = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  profile?: UserProfile;
};

export const UserSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  createTime: z.string(),
  updateTime: z.string(),
  profile: UserProfileSchema.optional(),
});

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

export const AuthenticatedUserSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  createTime: z.string(),
  updateTime: z.string(),
  customerId: z.string(),
  email: z.string(),
  newsletterSubscription: z.boolean(),
  role: z.string(),
  onboardingStatus: OnboardingStatusSchema,
  cookieToken: z.string().optional(),
  profile: UserProfileSchema.optional(),
});

export type GetAuthenticatedResponse = {
  user: AuthenticatedUser;
};

export const getAuthenticatedResponseValidator = AuthenticatedUserSchema;

export type UpdateAuthenticatedUserRequest = Partial<
  Omit<AuthenticatedUser, "uid" | "createTime" | "updateTime" | "customerId">
>;

export type UpdateAuthenticatedUserResponse = {
  user: AuthenticatedUser;
};

export const updateAuthenticatedUserResponseValidator = AuthenticatedUserSchema;

export type ListUsersRequest = {
  pageSize?: number;
  pageToken?: string;
  view?: ResourceView;
  filter?: string;
};

export type ListUsersResponse = {
  users: User[];
  nextPageToken: string;
  totalSize: number;
};

export const listUsersWithPaginationResponseValidator = z.object({
  users: z.array(UserSchema),
  nextPageToken: z.string(),
  totalSize: z.number(),
});

export type GetUserRequest = {
  userId: string;
  view?: ResourceView;
};

export type GetUserResponse = {
  user: User;
};

export const getUserResponseValidator = UserSchema;
