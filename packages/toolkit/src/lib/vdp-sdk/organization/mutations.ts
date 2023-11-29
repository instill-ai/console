import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";

export type CreateOrganizationPayload = {
  id: string;
  org_name: string;
};

export type CreateOrganizationResponse = {
  name: string;
  uid: string;
  id: string;
  create_time: string;
  update_time: string;
  org_name: string;
  customer_id: string;
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

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function updateOrganizationMutation({
  payload,
  accessToken,
  organizationName,
}: {
  payload: CreateOrganizationPayload;
  accessToken: Nullable<string>;
  organizationName: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.post<CreateOrganizationResponse>(
      `/organizations/${organizationName}`,
      payload
    );

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}
