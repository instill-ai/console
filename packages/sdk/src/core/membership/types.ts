import { z } from "zod";

import { Nullable } from "../../types";
import { Organization, OrganizationSchema } from "../organization";
import { User, UserSchema } from "../user/types";

export type MembershipRole = "admin" | "member" | "pending_member" | "owner";

export type MembershipState =
  | "MEMBERSHIP_STATE_ACTIVE"
  | "MEMBERSHIP_STATE_PENDING";

export const MembershipStateSchema = z.enum([
  "MEMBERSHIP_STATE_ACTIVE",
  "MEMBERSHIP_STATE_PENDING",
]);

export type UserMembership = {
  user: User;
  organization: Organization;
  name: Nullable<string>;
  role: MembershipRole;
  state: MembershipState;
};

export const UserMembershipSchema = z.object({
  user: UserSchema,
  organization: OrganizationSchema,
  name: z.string().nullable(),
  role: z.string(),
  state: MembershipStateSchema,
});

export type OrganizationMembership = {
  user: User;
  organization: Organization;
  name: Nullable<string>;
  role: MembershipRole;
  state: MembershipState;
};

export const OrganizationMembershipSchema = z.object({
  user: UserSchema,
  organization: OrganizationSchema,
  name: z.string().nullable(),
  role: z.string(),
  state: MembershipStateSchema,
});

export type ListUserMembershipsRequest = {
  userName: string;
};

export type ListUserMembershipsResponse = {
  memberships: UserMembership[];
};

export const listUserMembershipsResponseValidator =
  z.array(UserMembershipSchema);

export type GetUserMembershipRequest = {
  userMembershipName: string;
  view?: string;
};

export type GetUserMembershipResponse = {
  membership: UserMembership;
};

export const getUserMembershipResponseValidator = UserMembershipSchema;

export type ListOrganizationMembershipsRequest = {
  organizationName: string;
};

export type ListOrganizationMembershipsResponse = {
  memberships: OrganizationMembership[];
};

export const listOrganizationMembershipsResponseValidator = z.array(
  OrganizationMembershipSchema,
);

export type GetOrganizationMembershipRequest = {
  organizationMembershipName: string;
  view?: string;
};

export type GetOrganizationMembershipResponse = {
  membership: OrganizationMembership;
};

export const getOrganizationMembershipResponseValidator =
  OrganizationMembershipSchema;

export type DeleteUserMembershipRequest = {
  userMembershipName: string;
};

export type UpdateUserMembershipRequest = {
  userMembershipName: string;
  state?: MembershipState;
};

export type UpdateUserMembershipResponse = {
  membership: UserMembership;
};

export type DeleteOrganizationMembershipRequest = {
  organizationMembershipName: string;
};

export type UpdateOrganizationMembershipRequest = {
  organizationMembershipName: string;
  role?: MembershipRole;
  state?: MembershipState;
};

export type UpdateOrganizationMembershipResponse = {
  membership: OrganizationMembership;
};
