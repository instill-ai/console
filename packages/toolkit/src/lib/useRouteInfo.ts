"use client";

import type { NamespaceType, Nullable } from "instill-sdk";
import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";

import { useNamespaceType } from "./react-query-service";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UseRouteInfoSuccessReturn = {
  isSuccess: true;
  data: {
    namespaceType: NamespaceType;
    namespaceId: Nullable<string>;
    resourceId: Nullable<string>;
    pipelineName: Nullable<string>;
    connectorName: Nullable<string>;
    namespaceName: Nullable<string>;
    modelName: Nullable<string>;
    chatUid: Nullable<string>;
    tableUid: Nullable<string>;
    folderUid: Nullable<string>;
  };
};

export type UseRouteInfoFailedReturn = {
  isSuccess: false;
  data: {
    namespaceType: null;
    namespaceId: null;
    resourceId: null;
    pipelineName: null;
    connectorName: null;
    namespaceName: null;
    modelName: null;
    chatUid: null;
    tableUid: null;
    folderUid: null;
  };
};

export function useRouteInfo():
  | UseRouteInfoSuccessReturn
  | UseRouteInfoFailedReturn {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const params = useParams();
  const paramsSearch = useSearchParams();
  const entity = params.entity ? String(params.entity) : null;
  const id = params.id ? String(params.id) : null;
  const chatUid = paramsSearch?.get("chatUid")
    ? String(paramsSearch.get("chatUid"))
    : null;
  const tableUid = paramsSearch?.get("tableUid")
    ? String(paramsSearch.get("tableUid"))
    : null;
  const folderUid = paramsSearch?.get("folderUid")
    ? String(paramsSearch.get("folderUid"))
    : null;

  const namespaceType = useNamespaceType({
    enabled: enabledQuery && !!entity,
    namespace: entity ? entity : null,
    accessToken,
  });

  const [pipelineName, setPipelineName] =
    React.useState<Nullable<string>>(null);
  const [connectorName, setConnectorName] =
    React.useState<Nullable<string>>(null);
  const [namespaceName, setNamespaceName] =
    React.useState<Nullable<string>>(null);
  const [modelName, setModelName] = React.useState<Nullable<string>>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (namespaceType.data === "NAMESPACE_ORGANIZATION") {
      setPipelineName(`organizations/${entity}/pipelines/${id}`);
      setConnectorName(`organizations/${entity}/connectors/${id}`);
      setNamespaceName(`organizations/${entity}`);
      setModelName(`organizations/${entity}/models/${id}`);
      setIsSuccess(true);
    }

    if (namespaceType.data === "NAMESPACE_USER") {
      setPipelineName(`users/${entity}/pipelines/${id}`);
      setConnectorName(`users/${entity}/connectors/${id}`);
      setNamespaceName(`users/${entity}`);
      setModelName(`users/${entity}/models/${id}`);
      setIsSuccess(true);
    }
  }, [namespaceType.data, entity, id]);

  if (isSuccess && namespaceType.isSuccess) {
    return {
      data: {
        namespaceType: namespaceType.data,
        namespaceId: entity,
        resourceId: id,
        namespaceName,
        pipelineName,
        connectorName,
        modelName,
        chatUid,
        tableUid,
        folderUid,
      },
      isSuccess: true,
    };
  } else {
    return {
      isSuccess: false,
      data: {
        namespaceType: null,
        resourceId: null,
        namespaceId: null,
        namespaceName: null,
        pipelineName: null,
        connectorName: null,
        modelName: null,
        chatUid: null,
        tableUid: null,
        folderUid: null,
      },
    };
  }
}
