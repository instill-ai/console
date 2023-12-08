import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { Organization, OrganizationMembership, UserMembership } from "./types";

export type ListOrganizationsResponse = {
  organizations: Organization[];
  next_page_token: string;
  total_size: string;
};

export async function listOrganizationsQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");
    const organizations: Organization[] = [];

    const queryString = getQueryString({
      baseURL: "/organizations",
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } = await client.get<ListOrganizationsResponse>(queryString);

    organizations.push(...data.organizations);

    if (data.next_page_token) {
      organizations.push(
        ...(await listOrganizationsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
          filter,
        }))
      );
    }

    return Promise.resolve(organizations);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type OrganizationResponse = {
  organization: Organization;
};

export async function getOrganizationQuery({
  organizationID,
  accessToken,
}: {
  organizationID: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<OrganizationResponse>(
      `/organizations/${organizationID}`
    );

    return Promise.resolve(data.organization);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetOrganizationMembershipsResponse = {
  memberships: OrganizationMembership[];
};

export async function getOrganizationMembershipsQuery({
  organizationID,
  accessToken,
}: {
  organizationID: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetOrganizationMembershipsResponse>(
      `/organizations/${organizationID}/memberships`
    );

    return Promise.resolve(data.memberships);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetOrganizationMembershipResponse = {
  membership: OrganizationMembership;
};

export async function getOrganizationMembershipQuery({
  organizationID,
  userID,
  accessToken,
}: {
  organizationID: string;
  userID: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetOrganizationMembershipResponse>(
      `/organizations/${organizationID}/memberships/${userID}`
    );

    return Promise.resolve(data.membership);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserMembershipsResponse = {
  memberships: UserMembership[];
};

export async function getUserMembershipsQuery({
  userID,
  accessToken,
}: {
  userID: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUserMembershipsResponse>(
      `users/${userID}/memberships`
    );

    return Promise.resolve(data.memberships);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetUserMembershipResponse = {
  membership: UserMembership;
};

export async function getUserMembershipQuery({
  userID,
  organizationID,
  accessToken,
}: {
  userID: string;
  organizationID: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<GetUserMembershipsResponse>(
      `users/${userID}/memberships/${organizationID}`
    );

    return Promise.resolve(data.memberships);
  } catch (err) {
    return Promise.reject(err);
  }
}
