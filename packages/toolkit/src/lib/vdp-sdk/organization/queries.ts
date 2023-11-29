import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { Organization } from "./types";

export type ListOrganizationsResponse = {
  organizations: Organization[];
  next_page_token: string;
  total_size: string;
};

export async function listOrganizationsQuery({
  pageSize,
  nextPageToken,
  accessToken,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");
    const organizations: Organization[] = [];

    const queryString = getQueryString({
      baseURL: "/organizations",
      pageSize,
      nextPageToken,
      filter: null,
    });

    const { data } = await client.get<ListOrganizationsResponse>(queryString);

    organizations.push(...data.organizations);

    if (data.next_page_token) {
      organizations.push(
        ...(await listOrganizationsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.next_page_token,
        }))
      );
    }

    return Promise.resolve(organizations);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type OrganizationResponse = {
  organization: Organization[];
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
