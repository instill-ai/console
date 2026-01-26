import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateNamespaceConnectionRequest,
  CreateNamespaceConnectionResponse,
  DeleteNamespaceConnectionRequest,
  GetIntegrationRequest,
  GetIntegrationResponse,
  GetNamespaceConnectionRequest,
  GetNamespaceConnectionResponse,
  Integration,
  IntegrationConnection,
  ListIntegrationsRequest,
  ListIntegrationsResponse,
  ListNamespaceConnectionReferencedPipelinesRequest,
  ListNamespaceConnectionReferencedPipelinesResponse,
  ListNamespaceConnectionsRequest,
  ListNamespaceConnectionsResponse,
  ListPaginatedIntegrationsRequest,
  ListPaginatedIntegrationsResponse,
  ListPaginatedNamespaceConnectionReferencedPipelinesRequest,
  ListPaginatedNamespaceConnectionReferencedPipelinesResponse,
  ListPaginatedNamespaceConnectionsRequest,
  ListPaginatedNamespaceConnectionsResponse,
  TestNamespaceConnectionRequest,
  TestNamespaceConnectionResponse,
  UpdateNamespaceConnectionRequest,
  UpdateNamespaceConnectionResponse,
} from "./type";

export class IntegrationClient extends APIResource {
  /**
   * Returns a paginated list of the available integrations.
   */
  async listPaginatedIntegrations({
    pageToken,
    pageSize,
    filter,
  }: ListPaginatedIntegrationsRequest) {
    const queryString = getQueryString({
      baseURL: "/integrations",
      pageToken,
      pageSize,
      filter,
    });

    try {
      const data =
        await this._client.get<ListPaginatedIntegrationsResponse>(queryString);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a list of the available integrations.
   */

  async listIntegrations({
    pageSize = 100,
    pageToken,
    filter,
  }: ListIntegrationsRequest) {
    const queryString = getQueryString({
      baseURL: "/integrations",
      pageSize,
      pageToken,
      filter,
    });

    try {
      const integrations: Integration[] = [];

      const data =
        await this._client.get<ListPaginatedIntegrationsResponse>(queryString);

      integrations.push(...data.integrations);

      if (data.nextPageToken) {
        integrations.push(
          ...(
            await this.listIntegrations({
              pageSize,
              pageToken: data.nextPageToken,
              filter,
            })
          ).integrations,
        );
      }

      const res: ListIntegrationsResponse = {
        integrations,
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a paginated list of the connected integrations.
   */
  async listPaginatedNamespaceConnections({
    namespaceId,
    pageToken,
    pageSize,
    filter,
  }: ListPaginatedNamespaceConnectionsRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections`,
      pageToken,
      pageSize,
      filter,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceConnectionsResponse>(
          queryString,
        );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a list of the connected integrations.
   */
  async listNamespaceConnections({
    namespaceId,
    pageToken,
    pageSize = 100,
    filter,
  }: ListNamespaceConnectionsRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections`,
      pageSize,
      pageToken,
      filter,
    });

    try {
      const connections: IntegrationConnection[] = [];

      const data =
        await this._client.get<ListPaginatedNamespaceConnectionsResponse>(
          queryString,
        );

      connections.push(...data.connections);

      if (data.nextPageToken) {
        connections.push(
          ...(
            await this.listNamespaceConnections({
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
              filter,
            })
          ).connections,
        );
      }

      const res: ListNamespaceConnectionsResponse = {
        connections,
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a paginated list of the connection pipelines.
   */
  async listPaginatedNamespaceConnectionReferencedPipelines({
    namespaceId,
    connectionId,
    pageToken,
    pageSize = 100,
    filter,
  }: ListPaginatedNamespaceConnectionReferencedPipelinesRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections/${connectionId}/referenced-pipelines`,
      pageToken,
      pageSize,
      filter,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceConnectionReferencedPipelinesResponse>(
          queryString,
        );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns a list of the connection pipelines.
   */
  async listNamespaceConnectionReferencedPipelines({
    namespaceId,
    connectionId,
    pageToken,
    pageSize = 100,
    filter,
  }: ListNamespaceConnectionReferencedPipelinesRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections/${connectionId}/referenced-pipelines`,
      pageSize,
      pageToken,
      filter,
    });

    try {
      const pipelineIds: string[] = [];

      const data =
        await this._client.get<ListPaginatedNamespaceConnectionReferencedPipelinesResponse>(
          queryString,
        );

      pipelineIds.push(...data.pipelineIds);

      if (data.nextPageToken) {
        pipelineIds.push(
          ...(
            await this.listNamespaceConnectionReferencedPipelines({
              connectionId,
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
              filter,
            })
          ).pipelineIds,
        );
      }

      const res: ListNamespaceConnectionReferencedPipelinesResponse = {
        pipelineIds,
      };

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Gets a specific integration
   */

  async getIntegration({ view, integrationId }: GetIntegrationRequest) {
    const queryString = getQueryString({
      baseURL: `/integrations/${integrationId}`,
      view,
    });

    try {
      const data = await this._client.get<GetIntegrationResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Gets a specific integration connection
   */
  async getNamespaceConnection({
    view,
    connectionId,
    namespaceId,
  }: GetNamespaceConnectionRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections/${connectionId}`,
      view,
    });

    try {
      const data =
        await this._client.get<GetNamespaceConnectionResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Creates an integration connection
   */
  async createNamespaceConnection({
    id,
    integrationId,
    namespaceId,
    setup,
    method,
    identity,
    scopes,
    oAuthAccessDetails,
  }: CreateNamespaceConnectionRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/connections`,
    });

    try {
      const data = await this._client.post<CreateNamespaceConnectionResponse>(
        queryString,
        {
          body: JSON.stringify({
            id,
            integrationId,
            method,
            setup,
            identity,
            scopes,
            oAuthAccessDetails,
          }),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Updates an integration connection
   */
  async updateNamespaceConnection({
    namespaceId,
    connectionId,
    id,
    setup,
  }: UpdateNamespaceConnectionRequest) {
    try {
      const data = await this._client.patch<UpdateNamespaceConnectionResponse>(
        `/namespaces/${namespaceId}/connections/${connectionId}`,
        {
          body: JSON.stringify({
            id,
            setup,
          }),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Deletes an integration connection
   */
  async deleteNamespaceConnection({
    namespaceId,
    connectionId,
  }: DeleteNamespaceConnectionRequest) {
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
  async testNamespaceConnection({
    namespaceId,
    connectionId,
  }: TestNamespaceConnectionRequest) {
    try {
      await this._client.post<TestNamespaceConnectionResponse>(
        `/namespaces/${namespaceId}/connections/${connectionId}/test`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
