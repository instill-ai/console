import { z } from "zod";

import { ResourceView } from "../../pipeline";

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
  socialProfileLinks?: {
    website?: string;
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
  socialProfileLinks: z
    .object({
      website: z.string().optional(),
      x: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});

export type User = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `users/{user}`
  name: string;
  // Immutable canonical resource ID (e.g., "usr-8f3A2k9E7c1xYz")
  id: string;
  // Human-readable display name for UI
  displayName?: string;
  // URL-friendly slug (NO prefix)
  slug?: string;
  // Previous slugs for backward compatibility
  aliases?: string[];
  // Optional description / bio
  description?: string;
  // ===== Timestamps =====
  createTime: string;
  updateTime: string;
  // ===== Resource-specific fields =====
  profile?: UserProfile;
  email: string;
};

export const UserSchema = z.object({
  name: z.string(),
  id: z.string(),
  displayName: z.string().optional(),
  slug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().optional(),
  createTime: z.string(),
  updateTime: z.string(),
  profile: UserProfileSchema.optional(),
  email: z.string(),
});

export type AuthenticatedUser = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `users/{user}`
  name: string;
  // Immutable canonical resource ID (e.g., "usr-8f3A2k9E7c1xYz")
  id: string;
  // Human-readable display name for UI
  displayName: string;
  // URL-friendly slug (NO prefix)
  slug: string;
  // Previous slugs for backward compatibility
  aliases?: string[];
  // Optional description / bio
  description?: string;
  // ===== Timestamps =====
  createTime: string;
  updateTime: string;
  // ===== Resource-specific fields =====
  email: string;
  role?: string;
  newsletterSubscription: boolean;
  cookieToken?: string;
  onboardingStatus: OnboardingStatus;
  profile?: UserProfile;
  isEligibleForOrganizationTrial: boolean;
};

export const AuthenticatedUserSchema = z.object({
  name: z.string(),
  id: z.string(),
  displayName: z.string().optional(),
  slug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().optional(),
  createTime: z.string(),
  updateTime: z.string(),
  email: z.string(),
  role: z.string().optional(),
  newsletterSubscription: z.boolean(),
  onboardingStatus: OnboardingStatusSchema,
  cookieToken: z.string().optional(),
  profile: UserProfileSchema.optional(),
  isEligibleForOrganizationTrial: z.boolean().optional(),
});

export type GetAuthenticatedResponse = {
  user: AuthenticatedUser;
};

export const getAuthenticatedResponseValidator = AuthenticatedUserSchema;

export type UpdateAuthenticatedUserRequest = Partial<
  Omit<AuthenticatedUser, "id" | "createTime" | "updateTime">
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
