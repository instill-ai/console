import { Model } from "../../../lib";
import { ModelSettingsTabs } from "./ModelSettingsHead";
import { ModelSettingsVersions } from "./ModelSettingsVersions";

export type ContentViewerProps = {
  selectedTab: ModelSettingsTabs;
  model?: Model;
};

export const ModelSettingsContentViewer = ({
  selectedTab,
  model,
}: ContentViewerProps) => {
  if (!model) {
    return null;
  }

  switch (selectedTab) {
    case "versions":
      return <ModelSettingsVersions model={model} />;
  }

  return null;
};
