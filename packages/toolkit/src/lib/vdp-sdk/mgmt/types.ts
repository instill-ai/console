import { StripeSubscriptionDetail } from "../types";

export type UserProfile = {
  display_name?: string;
  bio?: string;
  public_email?: string;
  company_name?: string;
  avatar?: string;
  social_profiles?: {
    webiste?: string;
    x?: string;
    github?: string;
  };
};

export type AuthenticatedUser = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  customer_id: string;
  email: string;
  newsletter_subscription: boolean;
  role: string;
  onboarding_status: OnboardingStatus;
  cookie_token?: string;
  profile?: UserProfile;
};

export type User = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  profile?: UserProfile;
};

export type UserSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREEMIUM"
  | "PLAN_PRO";

export type UserSubscription = {
  plan: UserSubscriptionPlan;
  detail: StripeSubscriptionDetail;
};

export type ApiToken = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  access_token: string;
  state: ApiTokenState;
  token_type: string;
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
