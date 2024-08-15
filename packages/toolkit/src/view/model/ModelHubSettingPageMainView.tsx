"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import {
  InstillStore,
  useInstillStore,
  useQueryClient,
  useRouteInfo,
  useShallow,
  useUserModel,
  useWatchUserModels,
} from "../../lib";
import { ModelTabNames } from "../../server";
import { ModelContentViewer, ModelHead } from "./view-model";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelHubSettingPageMainView = () => {
  const router = useRouter();
  const routeInfo = useRouteInfo();
  const { path } = useParams();
  const queryClient = useQueryClient();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const setSelectedTab = (tabName: ModelTabNames) => {
    router.replace(
      `/${routeInfo.data.namespaceId}/models/${model.data?.id}/${tabName}`,
    );
  };

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const model = useUserModel({
    modelName: routeInfo.isSuccess ? routeInfo.data.modelName : null,
    enabled: enabledQuery && routeInfo.isSuccess,
    accessToken,
  });

  React.useEffect(() => {
    if (model.isError) {
      router.push("/404");
    }
  }, [model.isError, router]);

  const modelsWatchState = useWatchUserModels({
    modelNames: model.isSuccess ? [model.data.name] : [],
    enabled: enabledQuery && model.isSuccess,
    accessToken,
  });

  const modelState = React.useMemo(() => {
    if (model.isSuccess && modelsWatchState.isSuccess) {
      return modelsWatchState.data[model.data.name]?.state || null;
    }

    return null;
  }, [model, modelsWatchState]);

  const onModelUpdate = () => {
    model.refetch();

    // Invalidate default models list to have up to date data
    if (routeInfo.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["models", routeInfo.data.namespaceName, "infinite"],
      });
    }
  };

  return (
    <div className="flex flex-col">
      <ModelHead
        onTabChange={setSelectedTab}
        selectedTab={path?.[0] as ModelTabNames}
        model={model.data}
        isReady={model.isSuccess}
        modelState={modelState}
      />
      <ModelContentViewer
        selectedTab={path?.[0] as ModelTabNames}
        model={model.data}
        onUpdate={onModelUpdate}
        modelState={modelState}
      />
    </div>
  );
};
