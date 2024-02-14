import * as React from "react";
import { useRouter } from "next/router";
import { useNamespaceType } from "./react-query-service";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";
import { NamespaceType } from "./vdp-sdk";
import { Nullable } from "./type";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UseEntitySuccessReturn = {
  isSuccess: true;
  pipelineName: string;
  connectorName: string;
  entityName: string;
  modelName: string;
  namespaceType: NamespaceType;
  entity: Nullable<string>;
  id: Nullable<string>;
};

export type UseEntityFailedReturn = {
  isSuccess: false;
  pipelineName: null;
  connectorName: null;
  entityName: null;
  modelName: null;
  namespaceType: null;
  entity: null;
  id: null;
};

export function useEntity(): UseEntitySuccessReturn | UseEntityFailedReturn {
  const router = useRouter();
  const { entity, id } = router.query;
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const namespaceType = useNamespaceType({
    enabled: enabledQuery && !!entity,
    namespace: entity ? String(entity) : null,
    accessToken,
  });

  const pipelineName = React.useMemo(() => {
    if (!namespaceType.isSuccess) {
      return null;
    }

    return namespaceType.data === "NAMESPACE_ORGANIZATION"
      ? `organizations/${entity}/pipelines/${id}`
      : `users/${entity}/pipelines/${id}`;
  }, [id, entity, namespaceType.isSuccess, namespaceType.data]);

  const connectorName = React.useMemo(() => {
    if (!namespaceType.isSuccess) {
      return null;
    }

    return namespaceType.data === "NAMESPACE_ORGANIZATION"
      ? `organizations/${entity}/connectors/${id}`
      : `users/${entity}/connectors/${id}`;
  }, [id, entity, namespaceType.isSuccess, namespaceType.data]);

  const modelName = React.useMemo(() => {
    if (!namespaceType.isSuccess) {
      return null;
    }

    return namespaceType.data === "NAMESPACE_ORGANIZATION"
      ? `organizations/${entity}/models/${id}`
      : `users/${entity}/models/${id}`;
  }, [id, entity, namespaceType.isSuccess, namespaceType.data]);

  const entityName = React.useMemo(() => {
    if (!namespaceType.isSuccess) {
      return null;
    }

    return namespaceType.data === "NAMESPACE_ORGANIZATION"
      ? `organizations/${entity}`
      : `users/${entity}`;
  }, [entity, namespaceType.isSuccess, namespaceType.data]);

  React.useEffect(() => {
    if (!namespaceType.isSuccess) return;

    // checknamespace endpoint will only return NAMESPACE_RESERVED or NAMESPACE_AVAILABLE
    // when the namespace is not registered yet, which mean the entity is not exist.
    if (
      namespaceType.data === "NAMESPACE_RESERVED" ||
      namespaceType.data === "NAMESPACE_AVAILABLE"
    ) {
      router.push("/404");
      return;
    }

    if (entityName && pipelineName && connectorName && modelName) {
      setIsSuccess(true);
    }
  }, [
    entityName,
    pipelineName,
    modelName,
    connectorName,
    namespaceType.isSuccess,
    router,
  ]);

  if (isSuccess) {
    return {
      pipelineName: pipelineName as string,
      entityName: entityName as string,
      modelName: modelName as string,
      namespaceType: namespaceType.data as NamespaceType,
      isSuccess,
      connectorName: connectorName as string,
      entity: entity as string,
      id: id as string,
    };
  } else {
    return {
      pipelineName: null,
      entityName: null,
      modelName: null,
      namespaceType: null,
      isSuccess,
      connectorName: null,
      entity: null,
      id: null,
    };
  }
}
