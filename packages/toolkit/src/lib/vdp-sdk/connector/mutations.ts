/* eslint-disable @typescript-eslint/no-explicit-any */

import { AirbyteFieldValues } from "../../airbytes";
import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { Connector, ConnectorWithDefinition } from "./types";

export type CreateUserConnectorPayload = {
  id: string;
  connector_definition_name: string;
  description?: string;
  configuration: Record<string, any> | Record<string, never>;
};

export type CreateUserConnectorResponse = {
  connector: ConnectorWithDefinition;
};

export async function createUserConnectorMutation({
  entityName,
  payload,
  accessToken,
}: {
  entityName: string;
  payload: CreateUserConnectorPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const res = await client.post<CreateUserConnectorResponse>(
      `${entityName}/connectors`,
      payload
    );
    return Promise.resolve(res.data.connector);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUserConnectorMutation({
  connectorName,
  accessToken,
}: {
  connectorName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    await client.delete(`/${connectorName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateUserConnectorPayload = {
  connectorName: string;
  description?: string;
  configuration: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Record<string, any> | AirbyteFieldValues | Record<string, never>;
};

export type UpdateUserConnectorResponse = {
  connector: ConnectorWithDefinition;
};

export async function updateUserConnectorMutation({
  payload,
  accessToken,
}: {
  payload: UpdateUserConnectorPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const res = await client.patch<UpdateUserConnectorResponse>(
      `/${payload.connectorName}`,
      {
        ...payload,
        // connector name don't need to be sent to the server
        connectorName: undefined,
      }
    );
    return Promise.resolve(res.data.connector);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type RenameUserConnectorPayload = {
  connectorName: string;
  new_connector_id: string;
};

export type RenameUserConnectorResponse = {
  connector: Connector;
};

export async function renameUserConnector({
  payload,
  accessToken,
}: {
  payload: RenameUserConnectorPayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.post<RenameUserConnectorResponse>(
      `/${payload.connectorName}/rename`,
      {
        ...payload,
        // connector name don't need to be sent to the server
        connectorName: undefined,
      }
    );

    return Promise.resolve(data.connector);
  } catch (err) {
    return Promise.reject(err);
  }
}
