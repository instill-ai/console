import { ModelSettingsEditForm, ModelSettingsVersions } from ".";
import { Model } from "../../../lib";
import { ModelSettingsTabs } from "./ModelSettingsHead";

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

  let content: null | React.ReactNode;

  switch (selectedTab) {
    case "versions": {
      content = <ModelSettingsVersions model={model} />;

      break;
    }
    case "settings": {
      content = <ModelSettingsEditForm model={model} />;

      break;
    }
    default: {
      content = null;
    }
  }

  return <div className="mx-auto w-full max-w-7xl pt-8">{content}</div>;
};
