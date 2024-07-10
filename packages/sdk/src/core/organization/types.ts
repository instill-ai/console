import { Nullable, StripeSubscriptionDetail } from "../../types";
import { User } from "../user";

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

export type ListOrganizationsRequest = {
  pageSize?: number;
  pageToken?: string;
  view?: string;
  filter?: string;
};

export type ListOrganizationsResponse = {
  organizations: Organization[];
  nextPageToken: string;
  totalSize: string;
};

export type CreateOrganizationRequest = {
  id: string;
  profile?: OrganizationProfile;
};

export type CreateOrganizationResponse = {
  organization: Organization;
};

export type GetOrganizationRequest = {
  name: string;
};

export type GetOrganizationResponse = {
  organization: Organization;
};

export type DeleteOrganizationRequest = {
  name: string;
};

export type UpdateOrganizationRequest = {
  name: string;
  id?: string;
  profile?: Partial<OrganizationProfile>;
};

export type UpdateOrganizationResponse = {
  organization: Organization;
};
