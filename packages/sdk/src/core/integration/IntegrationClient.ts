import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  GetIntegrationRequest,
  GetIntegrationResponse,
  GetIntegrationsRequest,
  GetIntegrationsResponse,
  Integration,
} from "./type";

export class IntegrationClient extends APIResource {
  /**
   * Returns a paginated list of the available integration.
   */
  async getIntegrations(
    props: GetIntegrationsRequest & { enablePagination: true },
  ): Promise<GetIntegrationsResponse>;
  async getIntegrations(
    props: GetIntegrationsRequest & { enablePagination: false },
  ): Promise<Integration[]>;
  async getIntegrations(
    props: GetIntegrationsRequest & { enablePagination: undefined },
  ): Promise<Integration[]>;
  async getIntegrations(
    props: GetIntegrationsRequest & { enablePagination?: boolean },
  ): Promise<GetIntegrationsResponse | Integration[]>;
  async getIntegrations(
    props: GetIntegrationsRequest & { enablePagination?: boolean },
  ) {
    const { pageSize, pageToken, enablePagination, filter } = props;

    try {
      const integrations: Integration[] = [];

      const queryString = getQueryString({
        baseURL: "/integrations",
        pageSize,
        pageToken,
        filter,
      });

      const data = await this._client.get<GetIntegrationsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      integrations.push(...data.integrations);

      if (data.nextPageToken) {
        integrations.push(
          ...(await this.getIntegrations({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
          })),
        );
      }

      return Promise.resolve(integrations);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getIntegration(props: GetIntegrationRequest) {
    const { view, integrationId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/integrations/${integrationId}`,
        view,
      });

      const data = await this._client.get<GetIntegrationResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
