import { QueryClient } from "@tanstack/react-query";
import {
  ConnectorWatchState,
  ConnectorWithDefinition,
  ConnectorsWatchState,
  getConnectorDefinitionQuery,
  watchUserConnector,
} from "../../vdp-sdk";
import { Nullable } from "../../type";
import { removeObjKey } from "../../../server";

export type OnSuccessAfterConnectorMutationProps =
  | OnSuccessAfterDeleteConnectorProps
  | OnSuccessAfterCreateConnectorProps
  | OnSuccessAfterUpdateConnectorProps
  | OnSuccessAfterConnectConnectorProps
  | OnSuccessAfterDisconnectConnectorProps;

export type OnSuccessAfterDeleteConnectorProps = {
  type: "delete";
  queryClient: QueryClient;
  connectorName: string;
  connector?: ConnectorWithDefinition;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterCreateConnectorProps = {
  type: "create";
  queryClient: QueryClient;
  connector: ConnectorWithDefinition;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterUpdateConnectorProps = {
  type: "update";
  queryClient: QueryClient;
  connector: ConnectorWithDefinition;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterConnectConnectorProps = {
  type: "connect";
  queryClient: QueryClient;
  connector: ConnectorWithDefinition;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterDisconnectConnectorProps = {
  type: "disconnect";
  queryClient: QueryClient;
  connector: ConnectorWithDefinition;
  accessToken: Nullable<string>;
};

export async function onSuccessAfterConnectMutation(
  props: OnSuccessAfterConnectorMutationProps
) {
  const { type, queryClient } = props;

  if (type === "delete") {
    const connectorNameArray = props.connectorName.split("/");
    const userName = `${connectorNameArray[0]}/${connectorNameArray[1]}`;

    queryClient.removeQueries({
      queryKey: ["connectors", props.connectorName],
      exact: true,
    });

    queryClient.setQueryData<ConnectorWithDefinition[]>(
      [userName, "connectors", props.connector?.type],
      (old) => {
        return old ? old.filter((e) => e.name !== props.connectorName) : [];
      }
    );

    queryClient.setQueryData<ConnectorWithDefinition[]>(
      [userName, "connectors", "all"],
      (old) => {
        return old ? old.filter((e) => e.name !== props.connectorName) : [];
      }
    );

    // Process watch state
    queryClient.removeQueries({
      queryKey: ["connectors", "watch"],
      exact: true,
    });

    queryClient.setQueryData<ConnectorsWatchState>(
      ["connectors", "watch"],
      (old) => {
        return old ? removeObjKey(old, props.connectorName) : {};
      }
    );
    return;
  }

  const { accessToken, connector } = props;

  const connectorNameArray = connector.name.split("/");
  const userName = `${connectorNameArray[0]}/${connectorNameArray[1]}`;

  const connectorDefinition = await getConnectorDefinitionQuery({
    connectorDefinitionName: connector.connector_definition_name,
    accessToken,
  });

  const connectorWithDefinition = {
    ...connector,
    connector_definition: connectorDefinition,
  };

  queryClient.setQueryData<ConnectorWithDefinition>(
    ["connectors", connector.name],
    connectorWithDefinition
  );

  queryClient.setQueryData<ConnectorWithDefinition[]>(
    [userName, "connectors", connector.type],
    (old) =>
      old
        ? [...old.filter((e) => e.id !== connector.id), connectorWithDefinition]
        : [connectorWithDefinition]
  );

  queryClient.setQueryData<ConnectorWithDefinition[]>(
    [userName, "connectors", "all"],
    (old) =>
      old
        ? [...old.filter((e) => e.id !== connector.id), connectorWithDefinition]
        : [connectorWithDefinition]
  );

  // Process watch state
  const watch = await watchUserConnector({
    connectorName: connector.name,
    accessToken,
  });

  queryClient.setQueryData<ConnectorWatchState>(
    ["connectors", connector.name, "watch"],
    watch
  );

  queryClient.setQueryData<ConnectorsWatchState>(
    ["connectors", "watch"],
    (old) =>
      old
        ? {
            ...removeObjKey(old, connector.name),
            [connector.name]: watch,
          }
        : { [connector.name]: watch }
  );
}
