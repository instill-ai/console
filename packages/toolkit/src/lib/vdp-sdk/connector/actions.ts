import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { ConnectorState, ConnectorWithDefinition } from "./types";

export type TestUserConnectorConnectionResponse = {
  state: ConnectorState;
};

export async function testUserConnectorConnectionAction({
  connectorName,
  accessToken,
}: {
  connectorName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.post<TestUserConnectorConnectionResponse>(
      `/${connectorName}/testConnection`
    );
    return Promise.resolve(data.state);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ConnectUserConnectorResponse = {
  connector: ConnectorWithDefinition;
};

export async function connectUserConnectorAction({
  connectorName,
  accessToken,
}: {
  connectorName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.post<ConnectUserConnectorResponse>(
      `/${connectorName}/connect`
    );
    return Promise.resolve(data.connector);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type DisconnectUserConnectorResponse = {
  connector: ConnectorWithDefinition;
};

export async function disconnectUserConnectorAction({
  connectorName,
  accessToken,
}: {
  connectorName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.post<DisconnectUserConnectorResponse>(
      `/${connectorName}/disconnect`
    );
    return Promise.resolve(data.connector);
  } catch (err) {
    return Promise.reject(err);
  }
}
