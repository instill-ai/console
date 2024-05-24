"use client";

import * as React from "react";
import {
  GeneralAppPageProp,
  useAppEntity,
  useQueryClient,
  useUserModel,
} from "../../lib";
import {
  ModelContentViewer,
  ModelSettingsHead,
  ModelViewTabs,
} from "./view-model";

export type ModelHubSettingPageMainViewProps = GeneralAppPageProp;

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps
) => {
  const { accessToken, enableQuery } = props;
  const entityObject = useAppEntity();
  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] =
    React.useState<ModelViewTabs>("overview");

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
    queryClient.invalidateQueries({
      queryKey: ["models", "VISIBILITY_UNSPECIFIED"],
    });
  };

  return (
    <div className="flex flex-col">
      <ModelSettingsHead
        onTabChange={setSelectedTab}
        selectedTab={selectedTab}
        model={model.data}
        isReady={!model.isSuccess}
      />
      <ModelContentViewer
        selectedTab={selectedTab}
        model={model.data}
        onUpdate={onModelUpdate}
      />
    </div>
  );
};
