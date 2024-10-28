import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  DeleteOrganizationMembershipRequest,
  DeleteUserMembershipRequest,
  GetOrganizationMembershipRequest,
  GetOrganizationMembershipResponse,
  GetUserMembershipRequest,
  GetUserMembershipResponse,
  ListOrganizationMembershipsRequest,
  ListOrganizationMembershipsResponse,
  ListUserMembershipsRequest,
  ListUserMembershipsResponse,
  UpdateOrganizationMembershipRequest,
  UpdateOrganizationMembershipResponse,
  UpdateUserMembershipRequest,
  UpdateUserMembershipResponse,
} from "./types";

export class MembershipClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async getUserMembership({
    userId,
    organizationId,
    view,
  }: GetUserMembershipRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/users/${userId}/memberships/${organizationId}`,
        view,
      });

      const data =
        await this._client.get<GetUserMembershipResponse>(queryString);

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listUserMemberships({ userId }: ListUserMembershipsRequest) {
    try {
      const data = await this._client.get<ListUserMembershipsResponse>(
        `/users/${userId}/memberships`,
      );

      return Promise.resolve(data.memberships);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOrganizationMembership({
    userId,
    organizationId,
    view,
  }: GetOrganizationMembershipRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/organizations/${organizationId}/memberships/${userId}`,
        view,
      });

      const data =
        await this._client.get<GetOrganizationMembershipResponse>(queryString);

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listOrganizationMemberships({
    organizationId,
  }: ListOrganizationMembershipsRequest) {
    try {
      const data = await this._client.get<ListOrganizationMembershipsResponse>(
        `/organizations/${organizationId}/memberships`,
      );

      return Promise.resolve(data.memberships);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async deleteUserMembership({
    userId,
    organizationId,
  }: DeleteUserMembershipRequest) {
    try {
      await this._client.delete(
        `/users/${userId}/memberships/${organizationId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateUserMembership({
    userId,
    organizationId,
    state,
  }: UpdateUserMembershipRequest) {
    try {
      const data = await this._client.put<UpdateUserMembershipResponse>(
        `/users/${userId}/memberships/${organizationId}`,
        {
          body: JSON.stringify({ state }),
        },
      );

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteOrganizationMembership({
    organizationId,
    userId,
  }: DeleteOrganizationMembershipRequest) {
    try {
      await this._client.delete(
        `/organizations/${organizationId}/memberships/${userId}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateOrganizationMembership({
    userId,
    organizationId,
    state,
    role,
  }: UpdateOrganizationMembershipRequest) {
    try {
      const data = await this._client.put<UpdateOrganizationMembershipResponse>(
        `/organizations/${organizationId}/memberships/${userId}`,
        {
          body: JSON.stringify({ state, role }),
        },
      );

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
