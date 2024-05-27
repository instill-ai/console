"use client";

import * as React from "react";
import {
  GeneralAppPageProp,
  useAppEntity,
  useQueryClient,
  useUserModel,
} from "../../lib";
import { ModelContentViewer, ModelSettingsHead } from "./view-model";
import { useParams, useRouter } from "next/navigation";
import { ModelTabNames } from "../../server";

export type ModelHubSettingPageMainViewProps = GeneralAppPageProp;

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps
) => {
  const router = useRouter();
  const entity = useAppEntity();
  const { tab } = useParams();
  const { accessToken, enableQuery } = props;
  const entityObject = useAppEntity();
  const queryClient = useQueryClient();

  const setSelectedTab = (tabName: ModelTabNames) => {
    router.replace(
      `/${entity.data.entity}/models/${model.data?.id}/${tabName}`
    );
  };

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const model = useUserModel({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });

  const onModelUpdate = () => {
    model.refetch();

    // Invalidate default models list to have up to date data
    if (entity.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["models", entity.data.entityName, "infinite"],
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
      />
      <ModelContentViewer
        selectedTab={tab as ModelTabNames}
        model={model.data}
        onUpdate={onModelUpdate}
      />
    </div>
  );
};
