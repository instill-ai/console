"use client";

import * as React from "react";
import { GeneralAppPageProp, useAppEntity, useUserModel } from "../../lib";
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
        onUpdate={model.refetch}
      />
    </div>
  );
};
