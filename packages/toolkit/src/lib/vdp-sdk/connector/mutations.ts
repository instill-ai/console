/* eslint-disable @typescript-eslint/no-explicit-any */

import { AirbyteFieldValues } from "../../airbytes";
import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { ConnectorResource } from "./types";

export type CreateUserConnectorResourcePayload = {
  id: string;
  connector_definition_name: string;
  description?: string;
  configuration: Record<string, any> | Record<string, never>;
};

export type CreateUserConnectorResourceResponse = {
  connector_resource: ConnectorResource;
};

export async function createUserConnectorResourceMutation({
  userName,
  payload,
  accessToken,
}: {
  userName: string;
  payload: CreateUserConnectorResourcePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const res = await client.post<CreateUserConnectorResourceResponse>(
      `${userName}/connector-resources`,
      payload
    );
    return Promise.resolve(res.data.connector_resource);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteUserConnectorResourceMutation({
  connectorResourceName,
  accessToken,
}: {
  connectorResourceName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    await client.delete(`/${connectorResourceName}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type UpdateUserConnectorResourcePayload = {
  connectorResourceName: string;
  description?: string;
  configuration: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  Record<string, any> | AirbyteFieldValues | Record<string, never>;
};

export type UpdateUserConnectorResourceResponse = {
  connector_resource: ConnectorResource;
};

export async function updateUserConnectorResourceMutation({
  payload,
  accessToken,
}: {
  payload: UpdateUserConnectorResourcePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const res = await client.patch<UpdateUserConnectorResourceResponse>(
      `/${payload.connectorResourceName}`,
      {
        ...payload,
        connectorResourceName: undefined,
      }
    );
    return Promise.resolve(res.data.connector_resource);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type RenameUserConnectorResourcePayload = {
  name: string;
  new_connector_id: string;
};

export type RenameUserConnectorResourceResponse = {
  connector_resource: ConnectorResource;
};

export async function renameUserConnectorResource({
  payload,
  accessToken,
}: {
  payload: RenameUserConnectorResourcePayload;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");

    const { data } = await client.post<RenameUserConnectorResourceResponse>(
      `/${payload.name}/rename`,
      payload
    );

    return Promise.resolve(data.connector_resource);
  } catch (err) {
    return Promise.reject(err);
  }
}
