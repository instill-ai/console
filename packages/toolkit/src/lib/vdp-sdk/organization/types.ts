import { Nullable } from "../../type";
import { User } from "../mgmt";
import { StripeSubscriptionDetail } from "../types";

export type OrganizationProfile = {
  displayName?: string;
  bio?: string;
  publicEmail?: string;
  avatar?: string;
  socialProfilesLinks?: {
    webiste?: string;
    x?: string;
    github?: string;
  };
};

export type Organization = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  owner: User;
  profile?: OrganizationProfile;
};

export type OrganizationSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREEMIUM"
  | "PLAN_TEAM"
  | "PLAN_TEAM_PRO"
  | "PLAN_ENTERPRISE";

export type OrganizationSubscription = {
  plan: OrganizationSubscriptionPlan;
  detail: Nullable<StripeSubscriptionDetail>;
  maxSeats: number;
  usedSeats: number;
};

export type UserMembership = {
  user: User;
  organization: Organization;
  name: Nullable<string>;
  role: MembershipRole;
  state: MembershipState;
};

export type OrganizationMembership = {
  user: User;
  organization: Organization;
  name: Nullable<string>;
  role: MembershipRole;
  state: MembershipState;
};

export type MembershipRole = "admin" | "member" | "pending_member" | "owner";

export type MembershipState =
  | "MEMBERSHIP_STATE_ACTIVE"
  | "MEMBERSHIP_STATE_PENDING";
