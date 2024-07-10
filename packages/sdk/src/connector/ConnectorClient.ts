import { APIResource } from "../core/resource";
import { getQueryString } from "../helper";
import {
  ConnectorDefinition,
  GetConnectorDefinitionResponse,
  ListConnectorDefinitionsResponse,
} from "./types";

export class ConnectorClient extends APIResource {
  async listDefinitions({
    pageSize,
    nextPageToken,
    filter,
    view,
  }: {
    pageSize?: number;
    nextPageToken?: string;
    filter?: string;
    view?: string;
  }) {
    try {
      const definitions: ConnectorDefinition[] = [];

      const queryString = getQueryString({
        baseURL: `/connector-definitions`,
        pageSize,
        nextPageToken,
        filter,
        view,
      });

      const data =
        await this._client.get<ListConnectorDefinitionsResponse>(queryString);
      definitions.push(...data.connectorDefinitions);

      if (data.nextPageToken) {
        definitions.push(
          ...(await this.listDefinitions({
            pageSize,
            nextPageToken: data.nextPageToken,
            filter,
            view,
          })),
        );
      }

      return Promise.resolve(definitions);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getConnectorDefinition({
    name,
    view,
  }: {
    name: string;
    view?: string;
  }) {
    try {
      const queryString = getQueryString({
        baseURL: `/${name}`,
        view,
      });

      const data =
        await this._client.get<GetConnectorDefinitionResponse>(queryString);
      return Promise.resolve(data.connectorDefinition);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
