import {
  ModelSettingsEditForm,
  ModelVersions,
  ModelApi,
  ModelOverview,
} from ".";
import { LoadingSpin } from "../../../components";
import { Model, ModelState, Nullable } from "../../../lib";
import { ModelTabNames } from "../../../server";

export type ModelContentViewerProps = {
  selectedTab: ModelTabNames;
  model?: Model;
  onUpdate: () => void;
  modelState: Nullable<ModelState>;
};

export const ModelContentViewer = ({
  selectedTab,
  model,
  onUpdate,
  modelState,
}: ModelContentViewerProps) => {
  let content = null;

  switch (selectedTab) {
    case "api": {
      content = <ModelApi model={model} />;

      break;
    }
    case "versions": {
      content = <ModelVersions model={model} />;

      break;
    }
    case "settings": {
      if (model?.permission.canEdit) {
        content = <ModelSettingsEditForm model={model} onUpdate={onUpdate} />;
      }

      break;
    }
    case "overview":
    default: {
      content = <ModelOverview model={model} modelState={modelState} />;
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
