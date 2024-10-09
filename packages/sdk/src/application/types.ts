import { Nullable, Permission } from "../types";

export type Application = {
  name: string;
  uid: string;
  id: string;
  description: Nullable<string>;
  createTime: string;
  updateTime: Nullable<string>;
  deleteTime: Nullable<string>;
  ownerName: string;
  owner: {
    user?: {
      name: string;
      id: string;
    };
    organization?: {
      name: string;
      id: string;
    };
  };
  permission: Permission;
};

export type ListApplicationsRequest = {
  ownerId: string;
  pageSize?: Nullable<number>;
  pageToken?: Nullable<string>;
  view?: Nullable<string>;
};

export type ListApplicationsResponse = {
  apps: Application[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type GetApplicationRequest = {
  applicationName: string;
};

export type GetApplicationResponse = {
  app: Application;
};

export type CreateApplicationRequest = {
  ownerId: string;
  id: string;
  description?: Nullable<string>;
};

export type CreateApplicationResponse = {
  app: Application;
};

export type UpdateApplicationRequest = {
  ownerId: string;
  appId: string;
  newAppId?: Nullable<string>;
  newDescription?: Nullable<string>;
  newTags?: Nullable<string[]>;
};

export type UpdateApplicationResponse = {
  app: Application;
};

export type DeleteApplicationRequest = {
  ownerId: string;
  appId: string;
};
