import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { Organization } from "./types";

export type CreateOrganizationPayload = {
  id: string;
  org_name: string;
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

export type UpdateOrganizationPayload = {
  org_name: string;
  profile_data?: Nullable<Record<string, any>>;
  profile_avatar?: Nullable<string>;
};

export async function updateOrganizationMutation({
  payload,
  accessToken,
  organizationName,
}: {
  payload: UpdateOrganizationPayload;
  accessToken: Nullable<string>;
  organizationName: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.patch<CreateOrganizationResponse>(
      `/organizations/${organizationName}`,
      payload
    );

    return Promise.resolve(data.organization);
  } catch (err) {
    return Promise.reject(err);
  }
}