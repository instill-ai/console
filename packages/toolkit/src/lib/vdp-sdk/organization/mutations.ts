import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { Membership, Organization, ROLE } from "./types";

export type CreateOrganizationPayload = {
  id: string;
  org_name: string;
  profile_avatar?: Nullable<string>;
  profile_data?: Nullable<object>;
};

export type CreateOrganizationResponse = {
  organization: Organization;
};

export async function createOrganizationMutation({
  payload,
  accessToken,
}: {
  payload: CreateOrganizationPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.post<CreateOrganizationResponse>(
      "/organizations",
      payload
    );

    return Promise.resolve(data.organization);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateOrganizationResponse = {
  organization: Organization;
};

export type UpdateOrganizationPayload = {
  id: string;
  org_name: string;
  profile_avatar?: Nullable<string>;
  profile_data?: Nullable<object>;
};

export async function updateOrganizationMutation({
  payload,
  accessToken,
}: {
  payload: UpdateOrganizationPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.post<UpdateOrganizationResponse>(
      `/organizations/${payload.id}`,
      {
        ...payload,
        id: undefined,
      }
    );

    return Promise.resolve(data.organization);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteOrganizationMutation({
  organizationName,
  accessToken,
}: {
  organizationName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    await client.delete(`/organizations/${organizationName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function removeOrganizationUserMutation({
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

    await client.delete(
      `/organizations/${organizationName}/memberships/${userName}`
    );
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function leaveOrganizationMutation({
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

    await client.delete(`/users/${userName}/memberships/${organizationName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}
