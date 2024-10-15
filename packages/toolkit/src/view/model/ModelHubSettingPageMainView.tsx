"use client";

import * as React from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Nullable } from "instill-sdk";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeVersion = searchParams.get("version");
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

  const onModelRun = () => {
    modelsWatchState.refetch();
  };

  const updateActiveVersionUrl = (version: Nullable<string>) => {
    if (version === null) {
      router.replace(pathname);

      return;
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("version", version);

    const combinedSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(newSearchParams),
    });

    router.replace(`${pathname}?${combinedSearchParams.toString()}`);
  };

  React.useEffect(() => {
    if (model.isSuccess) {
      if (activeVersion) {
        if (model.data.versions.length > 0) {
          if (
            !model.data.versions.find((item) => item === activeVersion) &&
            model.data.versions[0]
          ) {
            updateActiveVersionUrl(model.data.versions[0]);
          }
        } else {
          updateActiveVersionUrl(null);
        }
      } else if (model.data.versions[0]) {
        updateActiveVersionUrl(model.data.versions[0]);
      }
    }
  }, [model.isSuccess, model.data, activeVersion, pathname]);

  return (
    <div className="flex flex-col">
      <ModelHead
        onActiveVersionUpdate={updateActiveVersionUrl}
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
        onRun={onModelRun}
        modelState={modelState}
      />
    </div>
  );
};
