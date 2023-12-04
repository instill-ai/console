import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { Membership, Organization } from "./types";

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
  organizationName,
  accessToken,
}: {
  organizationName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<OrganizationResponse>(
      `/organizations/${organizationName}`
    );

    return Promise.resolve(data.organization);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type OrganizationMembershipsResponse = {
  memberships: Membership[];
};

export async function getOrganizationMemberships({
  organizationName,
  accessToken,
}: {
  organizationName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<OrganizationMembershipsResponse>(
      `/organizations/${organizationName}/memberships`
    );

    return Promise.resolve(data.memberships);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getOrganizationMembership({
  organizationName,
  userName,
  accessToken,
}: {
  organizationName: string;
  userName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.get<OrganizationMembershipsResponse>(
      `/organizations/${organizationName}/memberships/${userName}`
    );

    return Promise.resolve(data.memberships);
  } catch (err) {
    return Promise.reject(err);
  }
}
