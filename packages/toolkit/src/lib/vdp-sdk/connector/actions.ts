import { Nullable } from "../../type";
import { createInstillAxiosClient } from "../helper";
import { ConnectorResource, ConnectorResourceState } from "./types";

export type TestUserConnectorResourceConnectionResponse = {
  state: ConnectorResourceState;
};

export async function testUserConnectorResourceConnectionAction({
  connectorResourceName,
  accessToken,
}: {
  connectorResourceName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } =
      await client.post<TestUserConnectorResourceConnectionResponse>(
        `/${connectorResourceName}/testConnection`
      );
    return Promise.resolve(data.state);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type ConnectUserConnectorResourceResponse = {
  connector_resource: ConnectorResource;
};

export async function connectUserConnectorResourceAction({
  connectorResourceName,
  accessToken,
}: {
  connectorResourceName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.post<ConnectUserConnectorResourceResponse>(
      `/${connectorResourceName}/connect`
    );
    return Promise.resolve(data.connector_resource);
  } catch (err) {
    return Promise.reject(err);
  }
}

export type DisconnectUserConnectorResourceResponse = {
  connector_resource: ConnectorResource;
};

export async function disconnectUserConnectorResourceAction({
  connectorResourceName,
  accessToken,
}: {
  connectorResourceName: string;
  accessToken: Nullable<string>;
}) {
  try {
    const client = createInstillAxiosClient(accessToken, "vdp");
    const { data } = await client.post<DisconnectUserConnectorResourceResponse>(
      `/${connectorResourceName}/disconnect`
    );
    return Promise.resolve(data.connector_resource);
  } catch (err) {
    return Promise.reject(err);
  }
}
