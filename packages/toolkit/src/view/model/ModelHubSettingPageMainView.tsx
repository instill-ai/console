"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import {
  GeneralAppPageProp,
  useQueryClient,
  useRouteInfo,
  useUserModel,
  useWatchUserModels,
} from "../../lib";
import { ModelTabNames } from "../../server";
import { ModelContentViewer, ModelSettingsHead } from "./view-model";

export type ModelHubSettingPageMainViewProps = GeneralAppPageProp;

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps,
) => {
  const router = useRouter();
  const routeInfo = useRouteInfo();
  const { tab } = useParams();
  const { accessToken, enableQuery } = props;
  const queryClient = useQueryClient();

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
    enabled: enableQuery && routeInfo.isSuccess,
    accessToken,
  });
  const modelsWatchState = useWatchUserModels({
    modelNames: model.isSuccess ? [model.data.name] : [],
    enabled: enableQuery && model.isSuccess,
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
    <div className="flex flex-col px-12">
      <ModelSettingsHead
        onTabChange={setSelectedTab}
        selectedTab={tab as ModelTabNames}
        model={model.data}
        isReady={!model.isSuccess}
        modelState={modelState}
      />
      <ModelContentViewer
        selectedTab={tab as ModelTabNames}
        model={model.data}
        onUpdate={onModelUpdate}
        modelState={modelState}
      />
    </div>
  );
};
