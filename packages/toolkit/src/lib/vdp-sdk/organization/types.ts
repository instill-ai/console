import { Nullable } from "../../type";
import { User } from "../mgmt";
import { StripeSubscriptionDetail } from "../types";

export type OrganizationProfile = {
  display_name?: string;
  bio?: string;
  public_email?: string;
  avatar?: string;
  social_profiles_links?: {
    webiste?: string;
    x?: string;
    github?: string;
  };
};

export type Organization = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  owner: User;
  profile?: OrganizationProfile;
};

export type OrganizationSubscriptionPlan =
  | "PLAN_UNSPECIFIED"
  | "PLAN_FREEMIUM"
  | "PLAN_TEAM"
  | "PLAN_ENTERPRISE";

export type OrganizationSubscription = {
  plan: OrganizationSubscriptionPlan;
  detail: StripeSubscriptionDetail;
  max_seats: number;
  used_seats: number;
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
