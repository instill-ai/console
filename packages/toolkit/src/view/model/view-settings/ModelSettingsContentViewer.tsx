import { ModelSettingsEditForm, ModelSettingsVersions } from ".";
import { LoadingSpin } from "../../../components";
import { Model } from "../../../lib";
import { ModelSettingsApi } from "./ModelSettingsApi";
import { ModelSettingsTabs } from "./ModelSettingsHead";
import { ModelSettingsOverview } from "./ModelSettingsOverview";

export type ContentViewerProps = {
  selectedTab: ModelSettingsTabs;
  model?: Model;
  onUpdate: () => void;
};

export const ModelSettingsContentViewer = ({
  selectedTab,
  model,
  onUpdate,
}: ContentViewerProps) => {
  let content: null | React.ReactNode;

  switch (selectedTab) {
    case "overview": {
      content = <ModelSettingsOverview model={model} />;

      break;
    }
    case "api": {
      content = <ModelSettingsApi model={model} />;

      break;
    }
    case "versions": {
      content = <ModelSettingsVersions model={model} />;

      break;
    }
    case "settings": {
      content = <ModelSettingsEditForm model={model} onUpdate={onUpdate} />;

      break;
    }
    default: {
      content = null;
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl pt-8">
      {model ? (
        content
      ) : (
        <LoadingSpin className="m-none !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
