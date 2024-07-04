import {
  ModelApi,
  ModelPlayground,
  ModelSettingsEditForm,
  ModelVersions,
  NoVersionsPlaceholder,
} from ".";
import { LoadingSpin } from "../../../components";
import { Model, ModelState, Nullable } from "../../../lib";
import { ModelTabNames } from "../../../server";
import { ModelReadme } from "./ModelReadme";

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
    case "readme": {
      content = <ModelReadme model={model} onUpdate={onUpdate} />;

      break;
    }
    case "playground":
    default: {
      content = modelState ? (
        <ModelPlayground model={model} modelState={modelState} />
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
