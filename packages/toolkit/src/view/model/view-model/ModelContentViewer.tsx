import {
  ModelSettingsEditForm,
  ModelVersions,
  ModelApi,
  ModelOverview,
  ModelViewTabs,
} from ".";
import { LoadingSpin } from "../../../components";
import { Model } from "../../../lib";

export type ModelContentViewerProps = {
  selectedTab: ModelViewTabs;
  model?: Model;
  onUpdate: () => void;
};

export const ModelContentViewer = ({
  selectedTab,
  model,
  onUpdate,
}: ModelContentViewerProps) => {
  let content = <ModelOverview model={model} />;

  switch (selectedTab) {
    case "overview": {
      content = <ModelOverview model={model} />;

      break;
    }
    case "api": {
      content = <ModelApi model={model} />;

      break;
    }
    case "versions": {
      content = <ModelVersions model={model} />;

      break;
    }
    case "settings": {
      if (model?.permission.can_edit) {
        content = <ModelSettingsEditForm model={model} onUpdate={onUpdate} />;
      }

      break;
    }
    default: {
      content = <ModelOverview model={model} />;
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
