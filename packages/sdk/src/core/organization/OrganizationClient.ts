import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  DeleteOrganizationRequest,
  GetOrganizationRequest,
  GetOrganizationResponse,
  InviteOrganizationMembersRequest,
  ListOrganizationsRequest,
  ListOrganizationsResponse,
  Organization,
  UpdateOrganizationRequest,
  UpdateOrganizationResponse,
} from "./types";

export class OrganizationClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  /**
   * Returns a paginated list of organizations
   */
  async listOrganizations(
    props: ListOrganizationsRequest & { enablePagination: true },
  ): Promise<ListOrganizationsResponse>;
  async listOrganizations(
    props: ListOrganizationsRequest & { enablePagination: false },
  ): Promise<Organization[]>;
  async listOrganizations(
    props: ListOrganizationsRequest & { enablePagination: boolean },
  ): Promise<ListOrganizationsResponse | Organization[]>;
  async listOrganizations(
    props: ListOrganizationsRequest & { enablePagination: boolean },
  ) {
    const { pageSize, pageToken, view, enablePagination, filter } = props;

    try {
      const organizations: Organization[] = [];

      const queryString = getQueryString({
        baseURL: "/organizations",
        pageSize,
        pageToken,
        filter,
        view,
      });

      const data =
        await this._client.get<ListOrganizationsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      organizations.push(...data.organizations);

      if (data.nextPageToken) {
        organizations.push(
          ...(await this.listOrganizations({
            pageSize,
            view,
            pageToken: data.nextPageToken,
            filter,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(organizations);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns the organization details by its Name
   */
  async getOrganization({ organizationId }: GetOrganizationRequest) {
    try {
      const data = await this._client.get<GetOrganizationResponse>(
        `/organizations/${organizationId}`,
      );

      return Promise.resolve(data.organization);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  /**
   * Creates an organization.
   */
  async createOrganization({ id, profile }: CreateOrganizationRequest) {
    try {
      const data = await this._client.post<CreateOrganizationResponse>(
        "/organizations",
        {
          body: JSON.stringify({ id, profile }),
        },
      );

      return Promise.resolve(data.organization);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Deletes an organization by its name
   */
  async deleteOrganization({ organizationId }: DeleteOrganizationRequest) {
    try {
      await this._client.delete(`/organizations/${organizationId}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Updates an organization by its name
   */
  async updateOrganization({
    organizationId,
    newOrganizationId,
    profile,
  }: UpdateOrganizationRequest) {
    try {
      const data = await this._client.patch<UpdateOrganizationResponse>(
        `/organizations/${organizationId}`,
        {
          body: JSON.stringify({ profile, id: newOrganizationId }),
        },
      );

      return Promise.resolve(data.organization);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async inviteOrganizationMembers({
    organizationId,
    emails,
  }: InviteOrganizationMembersRequest) {
    try {
      await this._client.post(
        `/organizations/${organizationId}/invite-members`,
        {
          body: JSON.stringify({ emails }),
        },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
