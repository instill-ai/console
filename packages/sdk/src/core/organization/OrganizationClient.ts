import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  DeleteOrganizationRequest,
  GetOrganizationRequest,
  GetOrganizationResponse,
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
  async getOrganization({ name }: GetOrganizationRequest) {
    try {
      const data = await this._client.get<GetOrganizationResponse>(`/${name}`);

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
  async createOrganization(props: CreateOrganizationRequest) {
    try {
      const data = await this._client.post<CreateOrganizationResponse>(
        "/organizations",
        {
          body: JSON.stringify(props),
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
  async deleteOrganization({ name }: DeleteOrganizationRequest) {
    try {
      await this._client.delete(`/${name}`);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Updates an organization by its name
   */
  async updateOrganization(props: UpdateOrganizationRequest) {
    const { name, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateOrganizationResponse>(
        `/${name}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.organization);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
