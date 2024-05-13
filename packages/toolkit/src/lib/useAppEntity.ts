"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useNamespaceType } from "./react-query-service";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";
import { NamespaceType } from "./vdp-sdk";
import { Nullable } from "./type";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UseAppEntitySuccessReturn = {
  isSuccess: true;
  data: {
    namespaceType: NamespaceType;
    entity: Nullable<string>;
    id: Nullable<string>;
    pipelineName: Nullable<string>;
    connectorName: Nullable<string>;
    entityName: Nullable<string>;
    modelName: Nullable<string>;
  };
};

export type UseAppEntityFailedReturn = {
  isSuccess: false;
  data: {
    namespaceType: null;
    entity: null;
    id: null;
    pipelineName: null;
    connectorName: null;
    entityName: null;
    modelName: null;
  };
};

export function useAppEntity():
  | UseAppEntitySuccessReturn
  | UseAppEntityFailedReturn {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const params = useParams();
  const entity = params.entity ? String(params.entity) : null;
  const id = params.id ? String(params.id) : null;

  const namespaceType = useNamespaceType({
    enabled: enabledQuery && !!entity,
    namespace: entity ? entity : null,
    accessToken,
  });

  const [pipelineName, setPipelineName] =
    React.useState<Nullable<string>>(null);
  const [connectorName, setConnectorName] =
    React.useState<Nullable<string>>(null);
  const [entityName, setEntityName] = React.useState<Nullable<string>>(null);
  const [modelName, setModelName] = React.useState<Nullable<string>>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (namespaceType.data === "NAMESPACE_ORGANIZATION") {
      setPipelineName(`organizations/${entity}/pipelines/${id}`);
      setConnectorName(`organizations/${entity}/connectors/${id}`);
      setEntityName(`organizations/${entity}`);
      setModelName(`organizations/${entity}/models/${id}`);
      setIsSuccess(true);
    }

    if (namespaceType.data === "NAMESPACE_USER") {
      setPipelineName(`users/${entity}/pipelines/${id}`);
      setConnectorName(`users/${entity}/connectors/${id}`);
      setEntityName(`users/${entity}`);
      setModelName(`users/${entity}/models/${id}`);
      setIsSuccess(true);
    }
  }, [namespaceType.data, entity, id]);

  if (isSuccess && namespaceType.isSuccess) {
    return {
      data: {
        namespaceType: namespaceType.data,
        entity,
        id,
        pipelineName,
        connectorName,
        entityName,
        modelName,
      },
      isSuccess: true,
    };
  } else {
    return {
      isSuccess: false,
      data: {
        namespaceType: null,
        entity: null,
        id: null,
        pipelineName: null,
        connectorName: null,
        entityName: null,
        modelName: null,
      },
    };
  }
}
