import {
  ModelSettingsEditForm,
  ModelVersions,
  ModelApi,
  ModelOverview,
  NoVersionsPlaceholder,
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
      content = modelState ? (
        <ModelVersions model={model} />
      ) : (
        <NoVersionsPlaceholder />
      );

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
      content = modelState ? (
        <ModelOverview model={model} modelState={modelState} />
      ) : (
        <NoVersionsPlaceholder />
      );
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
