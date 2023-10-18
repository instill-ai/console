import { QueryClient, useQueryClient } from "@tanstack/react-query";
import {
  ConnectorResource,
  ConnectorResourceWatchState,
  ConnectorResourceWithDefinition,
  ConnectorResourcesWatchState,
  getConnectorDefinitionQuery,
  getUserConnectorResourceQuery,
  watchUserConnectorResource,
} from "../../vdp-sdk";
import { Nullable } from "../../type";
import { removeObjKey } from "../../utility";

export type OnSuccessAfterConnectResourceMutationProps =
  | OnSuccessAfterDeleteConnectResourceProps
  | OnSuccessAfterCreateConnectResourceProps
  | OnSuccessAfterUpdateConnectResourceProps
  | OnSuccessAfterConnectConnectResourceProps
  | OnSuccessAfterDisconnectConnectResourceProps;

export type OnSuccessAfterDeleteConnectResourceProps = {
  type: "delete";
  queryClient: QueryClient;
  connectorResourceName: string;
  connectorResource?: ConnectorResourceWithDefinition;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterCreateConnectResourceProps = {
  type: "create";
  queryClient: QueryClient;
  connectorResource: ConnectorResource;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterUpdateConnectResourceProps = {
  type: "update";
  queryClient: QueryClient;
  connectorResource: ConnectorResource;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterConnectConnectResourceProps = {
  type: "connect";
  queryClient: QueryClient;
  connectorResource: ConnectorResource;
  accessToken: Nullable<string>;
};

export type OnSuccessAfterDisconnectConnectResourceProps = {
  type: "disconnect";
  queryClient: QueryClient;
  connectorResource: ConnectorResource;
  accessToken: Nullable<string>;
};

export async function onSuccessAfterConnectResourceMutation(
  props: OnSuccessAfterConnectResourceMutationProps
) {
  const { type, queryClient } = props;

  if (type === "delete") {
    const connectorResourceNameArray = props.connectorResourceName.split("/");
    const userName = `${connectorResourceNameArray[0]}/${connectorResourceNameArray[1]}`;

    queryClient.removeQueries(
      ["connector-resources", props.connectorResourceName],
      {
        exact: true,
      }
    );

    queryClient.setQueryData<ConnectorResourceWithDefinition[]>(
      ["connector-resources", userName, props.connectorResource?.type],
      (old) => {
        return old
          ? old.filter((e) => e.name !== props.connectorResourceName)
          : [];
      }
    );

    queryClient.setQueryData<ConnectorResourceWithDefinition[]>(
      ["connector-resources", userName, "all"],
      (old) => {
        return old
          ? old.filter((e) => e.name !== props.connectorResourceName)
          : [];
      }
    );

    // Process watch state
    queryClient.removeQueries(["connector-resources", "watch"], {
      exact: true,
    });

    queryClient.setQueryData<ConnectorResourcesWatchState>(
      ["connector-resources", "watch"],
      (old) => {
        return old ? removeObjKey(old, props.connectorResourceName) : {};
      }
    );
    return;
  }

  const { accessToken, connectorResource } = props;

  const connectorResourceNameArray = connectorResource.name.split("/");
  const userName = `${connectorResourceNameArray[0]}/${connectorResourceNameArray[1]}`;

  const connectorResourceDefinition = await getConnectorDefinitionQuery({
    connectorDefinitionName: connectorResource.connector_definition_name,
    accessToken,
  });

  const connectorResourceWithDefinition = {
    ...connectorResource,
    connector_definition: connectorResourceDefinition,
  };

  queryClient.setQueryData<ConnectorResourceWithDefinition>(
    ["connector-resources", connectorResource.name],
    connectorResourceWithDefinition
  );

  queryClient.setQueryData<ConnectorResourceWithDefinition[]>(
    ["connector-resources", userName, connectorResource.type],
    (old) =>
      old
        ? [
            ...old.filter((e) => e.id !== connectorResource.id),
            connectorResourceWithDefinition,
          ]
        : [connectorResourceWithDefinition]
  );

  queryClient.setQueryData<ConnectorResourceWithDefinition[]>(
    ["connector-resources", userName, "all"],
    (old) =>
      old
        ? [
            ...old.filter((e) => e.id !== connectorResource.id),
            connectorResourceWithDefinition,
          ]
        : [connectorResourceWithDefinition]
  );

  // Process watch state
  const watch = await watchUserConnectorResource({
    connectorResourceName: connectorResource.name,
    accessToken,
  });

  queryClient.setQueryData<ConnectorResourceWatchState>(
    ["connector-resources", "watch"],
    watch
  );

  queryClient.setQueryData<ConnectorResourcesWatchState>(
    ["connector-resources", "watch"],
    (old) =>
      old
        ? {
            ...removeObjKey(old, connectorResource.name),
            [connectorResource.name]: watch,
          }
        : { [connectorResource.name]: watch }
  );
}
