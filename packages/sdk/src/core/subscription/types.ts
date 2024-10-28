import { Nullable } from "../../types";

export type StripeSubscriptionStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_INCOMPLETE"
  | "STATUS_INCOMPLETE_EXPIRED"
  | "STATUS_TRIALING"
  | "STATUS_ACTIVE"
  | "STATUS_PAST_DUE"
  | "STATUS_CANCELED"
  | "STATUS_UNPAID"
  | "STATUS_PAUSED";

export type UserSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREE"
  | "PLAN_PRO"
  | "PLAN_UNPAID";

export type OrganizationSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREE"
  | "PLAN_TEAM"
  | "PLAN_ENTERPRISE"
  | "PLAN_UNPAID";

export type StripeSubscriptionDetail = {
  productName: string;
  id: string;
  itemId: string;
  price: number;
  canceledAt?: number;
  trialEnd?: number;
  status: StripeSubscriptionStatus;
  description: string;
};

export type UserSubscription = {
  plan: UserSubscriptionPlan;
  detail: Nullable<StripeSubscriptionDetail>;
};

export type OrganizationSubscription = {
  plan: OrganizationSubscriptionPlan;
  detail: Nullable<StripeSubscriptionDetail>;
  maxSeats: number;
  usedSeats: number;
};

export type GetAuthenticatedUserSubscriptionResponse = {
  subscription: UserSubscription;
};

export type GetOrganizationSubscriptionRequest = {
  organizationId: string;
};

export type GetOrganizationSubscriptionResponse = {
  subscription: OrganizationSubscription;
};
