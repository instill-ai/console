import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateIntegrationConnectionRequest,
  CreateIntegrationConnectionResponse,
  DeleteIntegrationConnectionRequest,
  GetConnectionPipelinesRequest,
  GetConnectionPipelinesResponse,
  GetIntegrationConnectionRequest,
  GetIntegrationConnectionResponse,
  GetIntegrationConnectionsRequest,
  GetIntegrationConnectionsResponse,
  GetIntegrationRequest,
  GetIntegrationResponse,
  GetIntegrationsRequest,
  GetIntegrationsResponse,
  Integration,
  IntegrationConnection,
  TestIntegrationConnectionRequest,
  TestIntegrationConnectionResponse,
  UpdateIntegrationConnectionRequest,
  UpdateIntegrationConnectionResponse,
} from "./type";

export class IntegrationClient extends APIResource {
  /**
   * Returns a paginated list of the available integrations.
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

  /**
   * Returns a paginated list of the connected integrations.
   */
  async getIntegrationConnections(
    props: GetIntegrationConnectionsRequest & { enablePagination: true },
  ): Promise<GetIntegrationConnectionsResponse>;
  async getIntegrationConnections(
    props: GetIntegrationConnectionsRequest & { enablePagination: false },
  ): Promise<IntegrationConnection[]>;
  async getIntegrationConnections(
    props: GetIntegrationConnectionsRequest & { enablePagination: undefined },
  ): Promise<IntegrationConnection[]>;
  async getIntegrationConnections(
    props: GetIntegrationConnectionsRequest & { enablePagination?: boolean },
  ): Promise<GetIntegrationConnectionsResponse | IntegrationConnection[]>;
  async getIntegrationConnections(
    props: GetIntegrationConnectionsRequest & { enablePagination?: boolean },
  ) {
    const { pageSize, pageToken, enablePagination, filter, namespaceId } =
      props;

    try {
      const connections: IntegrationConnection[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/connections`,
        pageSize,
        pageToken,
        filter,
      });

      const data =
        await this._client.get<GetIntegrationConnectionsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      connections.push(...data.connections);

      if (data.nextPageToken) {
        connections.push(
          ...(await this.getIntegrationConnections({
            namespaceId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
          })),
        );
      }

      return Promise.resolve(connections);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a paginated list of the connection pipelines.
   */
  async getConnectionPipelines(
    props: GetConnectionPipelinesRequest & { enablePagination: true },
  ): Promise<GetConnectionPipelinesResponse>;
  async getConnectionPipelines(
    props: GetConnectionPipelinesRequest & { enablePagination: false },
  ): Promise<string[]>;
  async getConnectionPipelines(
    props: GetConnectionPipelinesRequest & { enablePagination: undefined },
  ): Promise<string[]>;
  async getConnectionPipelines(
    props: GetConnectionPipelinesRequest & { enablePagination?: boolean },
  ): Promise<GetConnectionPipelinesResponse | string[]>;
  async getConnectionPipelines(
    props: GetConnectionPipelinesRequest & { enablePagination?: boolean },
  ) {
    const {
      pageSize,
      pageToken,
      enablePagination,
      filter,
      namespaceId,
      connectionId,
    } = props;

    try {
      const pipelineIds: string[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/connections/${connectionId}/referenced-pipelines`,
        pageSize,
        pageToken,
        filter,
      });

      const data =
        await this._client.get<GetConnectionPipelinesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      pipelineIds.push(...data.pipelineIds);

      if (data.nextPageToken) {
        pipelineIds.push(
          ...(await this.getConnectionPipelines({
            connectionId,
            namespaceId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            filter,
          })),
        );
      }

      return Promise.resolve(pipelineIds);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Gets a specific integration connection
   */
  async getIntegration(props: GetIntegrationRequest) {
    const { view, integrationId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/integrations/${integrationId}`,
        view,
      });

      const data = await this._client.get<GetIntegrationResponse>(queryString);

      return Promise.resolve(data.integration);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Gets a specific integration
   */
  async getIntegrationConnection(props: GetIntegrationConnectionRequest) {
    const { view, connectionId, namespaceId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/connections/${connectionId}`,
        view,
      });

      const data =
        await this._client.get<GetIntegrationConnectionResponse>(queryString);

      return Promise.resolve(data.connection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Adds an integration connection
   */
  async createIntegrationConnection({
    id,
    integrationId,
    namespaceId,
    setup,
    method,
    identity,
  }: CreateIntegrationConnectionRequest) {
    try {
      const data = await this._client.post<CreateIntegrationConnectionResponse>(
        `/namespaces/${namespaceId}/connections`,
        {
          body: JSON.stringify({
            id,
            integrationId,
            method,
            setup,
            identity,
          }),
        },
      );

      return Promise.resolve(data.connection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Updates an integration connection
   */
  async updateIntegrationConnection({
    namespaceId,
    connectionId,
    payload,
  }: UpdateIntegrationConnectionRequest) {
    try {
      const data =
        await this._client.patch<UpdateIntegrationConnectionResponse>(
          `/namespaces/${namespaceId}/connections/${connectionId}`,
          {
            body: JSON.stringify(payload),
          },
        );

      return Promise.resolve(data.connection);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes an integration connection
   */
  async deleteIntegrationConnection({
    namespaceId,
    connectionId,
  }: DeleteIntegrationConnectionRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/connections/${connectionId}`,
      );

      return Promise.resolve({ namespaceId, connectionId });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Tests an integration connection
   */
  async testIntegrationConnection(props: TestIntegrationConnectionRequest) {
    try {
      await this._client.post<TestIntegrationConnectionResponse>(
        `/namespaces/${props.namespaceId}/connections/${props.connectionId}/test`,
      );

      return Promise.resolve(props.connectionId);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
