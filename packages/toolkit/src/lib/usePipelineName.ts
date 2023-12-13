import * as React from "react";
import { useRouter } from "next/router";
import { useNamespaceType } from "./react-query-service";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";
import { NamespaceType } from "./vdp-sdk";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UseEntitySuccessReturn = {
  isSuccess: true;
  pipelineName: string;
  entityName: string;
  namespaceType: NamespaceType;
};

export type UseEntityFailedReturn = {
  isSuccess: false;
  pipelineName: null;
  entityName: null;
  namespaceType: null;
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

  const entityName = React.useMemo(() => {
    if (!namespaceType.isSuccess) {
      return null;
    }

    return namespaceType.data === "NAMESPACE_ORGANIZATION"
      ? `organizations/${entity}`
      : `users/${entity}`;
  }, [id, entity, namespaceType.isSuccess, namespaceType.data]);

  React.useEffect(() => {
    if (entityName && pipelineName && namespaceType.isSuccess) {
      setIsSuccess(true);
    }
  }, [entityName, pipelineName, namespaceType.isSuccess]);

  if (isSuccess) {
    return {
      pipelineName: pipelineName as string,
      entityName: entityName as string,
      namespaceType: namespaceType.data as NamespaceType,
      isSuccess,
    };
  } else {
    return {
      pipelineName: null,
      entityName: null,
      namespaceType: null,
      isSuccess,
    };
  }
}
