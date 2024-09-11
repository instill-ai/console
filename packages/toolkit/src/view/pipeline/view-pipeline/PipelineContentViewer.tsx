"use client";

import type { Pipeline, PipelineRelease } from "instill-sdk";
import * as React from "react";
import { useRouter } from "next/navigation";

import { LoadingSpin } from "../../../components";
import { useRouteInfo } from "../../../lib";
import { PipelineTabNames } from "../../../server";
import { PipelineApi } from "./PipelineApi";
import { PipelinePlayground } from "./PipelinePlayground";
import { PipelinePreview } from "./PipelinePreview";
import { PipelineReadme } from "./PipelineReadme";
import { PipelineRuns } from "./PipelineRuns";
import { PipelineSettings } from "./PipelineSettings";
import { PipelineVersions } from "./PipelineVersions";

export type PipelineContentViewerProps = {
  selectedTab: PipelineTabNames;
  pipeline?: Pipeline;
  onUpdate: () => void;
  releases: PipelineRelease[];
  isReady: boolean;
};

export const PipelineContentViewer = ({
  selectedTab,
  pipeline,
  onUpdate,
  releases,
  isReady,
}: PipelineContentViewerProps) => {
  const router = useRouter();
  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (
      pipeline &&
      selectedTab === "settings" &&
      !pipeline.permission.canEdit
    ) {
      const playgroundPath = `/${routeInfo.data?.namespaceId}/pipelines/${pipeline.id}/playground`;
      router.push(playgroundPath);
    }
  }, [selectedTab, pipeline, routeInfo.data?.namespaceId, router]);

  let content = null;

  switch (selectedTab) {
    case "api": {
      content = <PipelineApi pipeline={pipeline} releases={releases} />;

      break;
    }
    case "versions": {
      content = <PipelineVersions releases={releases} isReady={isReady} />;

      break;
    }
    case "settings": {
      if (pipeline?.permission.canEdit) {
        content = <PipelineSettings pipeline={pipeline} onUpdate={onUpdate} />;
      }
      else {
        content = null
      }

      break;
    }
    case "readme": {
      content = <PipelineReadme pipeline={pipeline} onUpdate={onUpdate} />;

      break;
    }
    case "preview": {
      content = <PipelinePreview pipeline={pipeline} releases={releases} />;

      break;
    }
    case "runs": {
      content = <PipelineRuns pipeline={pipeline} />;

      break;
    }
    case "playground":
    default: {
      content = <PipelinePlayground pipeline={pipeline} releases={releases} />;
    }
  }

  return (
    <div className="w-full pt-8 flex-1 flex flex-col h-full">
      {pipeline ? (
        content
      ) : (
        <LoadingSpin className="m-none !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
