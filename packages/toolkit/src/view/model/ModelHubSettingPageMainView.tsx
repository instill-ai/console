"use client";

import * as React from "react";
import { GeneralAppPageProp, useAppEntity, useUserModel } from "../../lib";
import {
  ModelSettingsContentViewer,
  ModelSettingsHead,
  ModelSettingsTabs,
} from "./view-settings";

export type ModelHubSettingPageMainViewProps = GeneralAppPageProp;

export const ModelHubSettingPageMainView = (
  props: ModelHubSettingPageMainViewProps
) => {
  const { accessToken, enableQuery } = props;
  const entityObject = useAppEntity();

  const [selectedTab, setSelectedTab] =
    React.useState<ModelSettingsTabs>("api");

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const model = useUserModel({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  });

  /* const modelReadme = useUserModelReadme({
    modelName: entityObject.isSuccess ? entityObject.data.modelName : null,
    enabled: enableQuery && entityObject.isSuccess,
    accessToken,
  }); */

  console.log(model?.data);

  return (
    <div className="flex flex-col">
      <ModelSettingsHead
        onTabChange={setSelectedTab}
        selectedTab={selectedTab}
        model={model.data}
      />
      <ModelSettingsContentViewer
        selectedTab={selectedTab}
        model={model.data}
        onUpdate={model.refetch}
      />
    </div>
  );
};
