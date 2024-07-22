import { z } from "zod";

import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  ConnectorDefinition,
  ConnectorDefinitionSchema,
  GetConnectorDefinitionRequest,
  GetConnectorDefinitionResponse,
  GetOperatorDefinitionRequest,
  GetOperatorDefinitionResponse,
  ListConnectorDefinitionsRequest,
  ListConnectorDefinitionsResponse,
  ListOperatorDefinitionsRequest,
  ListOperatorDefinitionsResponse,
  OperatorDefinition,
  OperatorDefinitionSchema,
} from "./types";

export class ComponentClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  listConnectorDefinitionsValidatorWithPagination = z.object({
    connectorDefinitions: z.array(ConnectorDefinitionSchema),
    nextPageToken: z.string(),
    totalSize: z.number(),
  });

  listConnectorDefinitionsValidatorWithoutPagination = z.array(
    ConnectorDefinitionSchema,
  );

  async listConnectorDefinitions(
    props: ListConnectorDefinitionsRequest & { enablePagination: true },
  ): Promise<ListConnectorDefinitionsResponse>;
  async listConnectorDefinitions(
    props: ListConnectorDefinitionsRequest & { enablePagination: false },
  ): Promise<ConnectorDefinition[]>;
  async listConnectorDefinitions(
    props: ListConnectorDefinitionsRequest & { enablePagination: boolean },
  ): Promise<ListConnectorDefinitionsResponse | ConnectorDefinition[]>;
  async listConnectorDefinitions(
    props: ListConnectorDefinitionsRequest & { enablePagination: boolean },
  ) {
    const { pageSize, pageToken, filter, view, enablePagination } = props;

    try {
      const definitions: ConnectorDefinition[] = [];

      const queryString = getQueryString({
        baseURL: `/connector-definitions`,
        pageSize,
        pageToken,
        filter,
        view,
      });

      const data =
        await this._client.get<ListConnectorDefinitionsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      definitions.push(...data.connectorDefinitions);

      if (data.nextPageToken) {
        definitions.push(
          ...(await this.listConnectorDefinitions({
            pageSize,
            pageToken: data.nextPageToken,
            filter,
            view,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(definitions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getConnectorDefinitionValidator = ConnectorDefinitionSchema;

  async getConnectorDefinition({
    connectorDefinitionName,
    view,
  }: GetConnectorDefinitionRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${connectorDefinitionName}`,
        view,
      });

      const data =
        await this._client.get<GetConnectorDefinitionResponse>(queryString);
      return Promise.resolve(data.connectorDefinition);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getOperatorDefinitionValidator = OperatorDefinitionSchema;

  async getOperatorDefinition({
    operatorDefinitionName,
    view,
  }: GetOperatorDefinitionRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/${operatorDefinitionName}`,
        view,
      });

      const data =
        await this._client.get<GetOperatorDefinitionResponse>(queryString);
      return Promise.resolve(data.operatorDefinition);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  listOperatorDefinitionsValidatorWithPagination = z.object({
    operatorDefinitions: z.array(OperatorDefinitionSchema),
    nextPageToken: z.string(),
    totalSize: z.number(),
  });

  async listOperatorDefinitions(
    props: ListOperatorDefinitionsRequest & {
      enablePagination: true;
    },
  ): Promise<ListOperatorDefinitionsResponse>;
  async listOperatorDefinitions(
    props: ListOperatorDefinitionsRequest & {
      enablePagination: false;
    },
  ): Promise<OperatorDefinition[]>;
  async listOperatorDefinitions(
    props: ListOperatorDefinitionsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListOperatorDefinitionsResponse | OperatorDefinition[]>;
  async listOperatorDefinitions(
    props: ListOperatorDefinitionsRequest & {
      enablePagination: boolean;
    },
  ) {
    const { pageSize, pageToken, filter, view, enablePagination } = props;

    try {
      const operatorDefinitions: OperatorDefinition[] = [];

      const queryString = getQueryString({
        baseURL: "/operator-definitions",
        pageSize,
        pageToken,
        filter,
        view,
      });

      const data =
        await this._client.get<ListOperatorDefinitionsResponse>(queryString);

      operatorDefinitions.push(...data.operatorDefinitions);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      if (data.nextPageToken) {
        operatorDefinitions.push(
          ...(await this.listOperatorDefinitions({
            pageSize,
            view,
            pageToken: data.nextPageToken,
            filter,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(operatorDefinitions);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/
}
