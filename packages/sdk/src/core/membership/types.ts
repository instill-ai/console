import { Nullable } from "../../types";
import { Organization } from "../organization";
import { User } from "../user/types";

export type MembershipRole = "admin" | "member" | "pending_member" | "owner";

export type MembershipState =
  | "MEMBERSHIP_STATE_ACTIVE"
  | "MEMBERSHIP_STATE_PENDING";

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

export type ListUserMembershipsRequest = {
  /**
   * The parent resource, i.e., the user to which the memberships belong.
   * Format: users/{user.id}.
   */
  userName: string;
};

export type ListUserMembershipsResponse = {
  memberships: UserMembership[];
};

export type GetUserMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by user and
   * organization ID.
   * Format: users/{user.id}/memberships/{organization.id}.
   */
  userMembershipName: string;
  view?: string;
};

export type GetUserMembershipResponse = {
  membership: UserMembership;
};

export type ListOrganizationMembershipsRequest = {
  /**
   * The parent resource, i.e., the organization to which the memberships
   * belong.
   * Format: organizations/{organization.id}.
   */
  organizationName: string;
};

export type ListOrganizationMembershipsResponse = {
  memberships: OrganizationMembership[];
};

export type GetOrganizationMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by
   * organization and user ID.
   * Format: organizations/{organization.id}/memberships/{user.id}.
   */
  organizationMembershipName: string;
  view?: string;
};

export type GetOrganizationMembershipResponse = {
  membership: OrganizationMembership;
};

export type DeleteUserMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by user and
   * organization ID.
   * Format: users/{user.id}/memberships/{organization.id}.
   */
  userMembershipName: string;
};

export type UpdateUserMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by user an
   * organization ID.
   * Format: users/{user.id}/memberships/{organization.id}.
   */
  userMembershipName: string;
  state?: MembershipState;
};

export type UpdateUserMembershipResponse = {
  membership: UserMembership;
};

export type DeleteOrganizationMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by
   * organization and user ID.
   * Format: organizations/{organization.id}/memberships/{user.id}.
   */
  organizationMembershipName: string;
};

export type UpdateOrganizationMembershipRequest = {
  /**
   * The resource name of the membership, which allows its access by
   * organization and user ID.
   * Format: organizations/{organization.id}/memberships/{user.id}.
   */
  organizationMembershipName: string;
  role?: MembershipRole;
  state?: MembershipState;
};

export type UpdateOrganizationMembershipResponse = {
  membership: OrganizationMembership;
};
