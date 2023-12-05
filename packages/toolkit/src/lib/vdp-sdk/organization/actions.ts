import { MEMBERSHIP_STATE, Membership, ROLE } from "./types";
import { createInstillAxiosClient } from "../helper";
import { Nullable } from "../../type";

export type AcceptOrganizationMembershipPayload = {
  state: MEMBERSHIP_STATE;
  organizationName?: Nullable<string>;
  userName?: Nullable<string>;
};

export type MembershipResponse = {
  membership: Membership;
};

export type UpdateOrganizationMembershipRolePayload = {
  role: ROLE;
  organizationName?: Nullable<string>;
  userName?: Nullable<string>;
};

export async function acceptOrganizationMembershipAction({
  payload,
  accessToken,
}: {
  payload: AcceptOrganizationMembershipPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "core");

    const { data } = await client.put<MembershipResponse>(
      `/organizations/${payload.userName}/memberships/${payload.organizationName}`,
      { ...payload, userName: undefined, organizationName: undefined }
    );

    return Promise.resolve(data.membership);
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
