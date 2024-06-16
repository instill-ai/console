import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../helper";
import { ConnectorDefinition } from "./types";

export type ListConnectorDefinitionsResponse = {
  connectorDefinitions: ConnectorDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export async function listConnectorDefinitionsQuery({
  pageSize,
  nextPageToken,
  accessToken,
  filter,
}: {
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);
    const connectorDefinitions: ConnectorDefinition[] = [];

    const queryString = getQueryString({
      baseURL: `/connector-definitions?view=VIEW_FULL`,
      pageSize,
      nextPageToken,
      filter,
    });

    const { data } =
      await client.get<ListConnectorDefinitionsResponse>(queryString);

    connectorDefinitions.push(...data.connectorDefinitions);

    if (data.nextPageToken) {
      connectorDefinitions.push(
        ...(await listConnectorDefinitionsQuery({
          pageSize,
          accessToken,
          nextPageToken: data.nextPageToken,
          filter,
        }))
      );
    }

    return Promise.resolve(connectorDefinitions);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type GetConnectorDefinitionResponse = {
  connectorDefinition: ConnectorDefinition;
};

export async function getConnectorDefinitionQuery({
  connectorDefinitionName,
  accessToken,
}: {
  connectorDefinitionName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken);

    const { data } = await client.get<GetConnectorDefinitionResponse>(
      `/${connectorDefinitionName}?view=VIEW_FULL`
    );

    return Promise.resolve(data.connectorDefinition);
  } catch (err) {
    return Promise.reject(err);
  }
}
