import { MEMBERSHIP_STATE, Membership, ROLE } from "./types";
import { createInstillAxiosClient } from "../helper";
import { Nullable } from "../../type";

export type AcceptOrganizationMembershipPayload = {
  role: MEMBERSHIP_STATE;
};

export type MembershipResponse = {
  membership: Membership;
};

export type UpdateOrganizationMembershipRolePayload = {
  role: ROLE;
};

export async function updateOrganizationMembershipRoleAction({
  payload,
  accessToken,
  organizationName,
  userName,
}: {
  payload: UpdateOrganizationMembershipRolePayload;
  accessToken: Nullable<string>;
  organizationName: string;
  userName: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.patch<MembershipResponse>(
      `/organizations/${organizationName}/memberships/${userName}`,
      payload
    );

    return Promise.resolve(data.membership);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function acceptOrganizationMembershipAction({
  payload,
  accessToken,
  organizationName,
  userName,
}: {
  payload: AcceptOrganizationMembershipPayload;
  accessToken: Nullable<string>;
  organizationName: string;
  userName: string;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.patch<MembershipResponse>(
      `/organizations/${userName}/memberships/${organizationName}`,
      payload
    );

    return Promise.resolve(data.membership);
  } catch (err) {
    return Promise.reject(err);
  }
}
