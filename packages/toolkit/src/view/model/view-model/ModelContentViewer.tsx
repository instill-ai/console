"use client";

import type { Model, ModelState, Nullable } from "instill-sdk";
import * as React from "react";
import { useRouter } from "next/navigation";

import {
  ModelApi,
  ModelPlayground,
  ModelSettingsEditForm,
  ModelVersions,
  NoVersionsPlaceholder,
} from ".";
import { PlaygroundSkeleton } from "../../../components";
import { useRouteInfo } from "../../../lib";
import { ModelTabNames } from "../../../server";
import { ModelReadme } from "./ModelReadme";
import { ModelRuns } from "./ModelRuns";

export type ModelContentViewerProps = {
  selectedTab: ModelTabNames;
  model?: Model;
  onUpdate: () => void;
  onRun: () => void;
  modelState: Nullable<ModelState>;
};

export const ModelContentViewer = ({
  selectedTab,
  model,
  onUpdate,
  onRun,
  modelState,
}: ModelContentViewerProps) => {
  const router = useRouter();
  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (model && selectedTab === "settings" && !model.permission.canEdit) {
      const playgroundPath = `/${routeInfo.data?.namespaceId}/models/${model.id}/playground`;
      router.push(playgroundPath);
    }
  }, [selectedTab, model, routeInfo.data?.namespaceId, router]);

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
      } else {
        content = null;
      }

      break;
    }
    case "readme": {
      content = <ModelReadme model={model} onUpdate={onUpdate} />;

      break;
    }
    case "runs": {
      content = <ModelRuns model={model} />;

      break;
    }
    case "playground":
    default: {
      content = modelState ? (
        <ModelPlayground model={model} modelState={modelState} onRun={onRun} />
      ) : (
        <NoVersionsPlaceholder />
      );
    }
  }

  return (
    <div className="w-full pt-8">
      {model ? content : <PlaygroundSkeleton />}
    </div>
  );
};
