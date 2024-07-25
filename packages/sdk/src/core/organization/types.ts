import { z } from "zod";

import { User, UserSchema } from "../user";

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

export const OrganizationProfileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  publicEmail: z.string().optional(),
  avatar: z.string().optional(),
  socialProfilesLinks: z
    .object({
      webiste: z.string().optional(),
      x: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});

export type Organization = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  owner: User;
  profile?: OrganizationProfile;
};

export const OrganizationSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  createTime: z.string(),
  updateTime: z.string(),
  owner: UserSchema,
  profile: OrganizationProfileSchema.optional(),
});

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
