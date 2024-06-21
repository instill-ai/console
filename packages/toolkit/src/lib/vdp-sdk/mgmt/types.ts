import { Nullable } from "../../type";
import { StripeSubscriptionDetail } from "../types";

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

export type User = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  profile?: UserProfile;
};

export type UserSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREEMIUM"
  | "PLAN_STARTER";

export type UserSubscription = {
  plan: UserSubscriptionPlan;
  detail: Nullable<StripeSubscriptionDetail>;
};

export type ApiToken = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  accessToken: string;
  state: ApiTokenState;
  tokenType: string;
  lastUserTime: string;
};

export type ApiTokenState =
  | "STATE_UNSPECIFIED"
  | "STATE_INACTIVE"
  | "STATE_ACTIVE"
  | "STATE_EXPIRED";

export type NamespaceType =
  | "NAMESPACE_UNSPECIFIED"
  | "NAMESPACE_AVAILABLE"
  | "NAMESPACE_USER"
  | "NAMESPACE_ORGANIZATION"
  | "NAMESPACE_RESERVED";

export type OnboardingStatus =
  | "ONBOARDING_STATUS_UNSPECIFIED"
  | "ONBOARDING_STATUS_IN_PROGRESS"
  | "ONBOARDING_STATUS_COMPLETED";
