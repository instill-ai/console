import { APIResource } from "../core/resource";
import { getQueryString } from "../helper";
import {
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

  async listUserMemberships({ userName }: ListUserMembershipsRequest) {
    try {
      const data = await this._client.get<ListUserMembershipsResponse>(
        `/${userName}`,
      );

      return Promise.resolve(data.memberships);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUserMembership({
    userMembershipName,
    view,
  }: GetUserMembershipRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${userMembershipName}`,
        view,
      });

      const data =
        await this._client.get<GetUserMembershipResponse>(queryString);

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listOrganizationMemberships({
    organizationName,
  }: ListOrganizationMembershipsRequest) {
    try {
      const data = await this._client.get<ListOrganizationMembershipsResponse>(
        `/${organizationName}`,
      );

      return Promise.resolve(data.memberships);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOrganizationMembership({
    organizationMembershipName,
    view,
  }: GetOrganizationMembershipRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${organizationMembershipName}`,
        view,
      });

      const data =
        await this._client.get<GetOrganizationMembershipResponse>(queryString);

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async deleteUserMembership({
    userMembershipName,
  }: DeleteUserMembershipRequest) {
    try {
      await this._client.delete(`/${userMembershipName}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateUserMembership({
    userMembershipName,
    state,
  }: UpdateUserMembershipRequest) {
    try {
      const data = await this._client.put<UpdateUserMembershipResponse>(
        `/${userMembershipName}`,
        {
          body: JSON.stringify({ state }),
        },
      );

      return Promise.resolve(data.membership);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateOrganizationMembership({
    organizationMembershipName,
    state,
    role,
  }: UpdateOrganizationMembershipRequest) {
    try {
      const data = await this._client.put<UpdateOrganizationMembershipResponse>(
        `/${organizationMembershipName}`,
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
