import type { Pipeline, PipelineRelease } from "instill-sdk";

import { LoadingSpin } from "../../../components";
import { PipelineTabNames } from "../../../server";
import { PipelineApi } from "./PipelineApi";
import { PipelinePlayground } from "./PipelinePlayground";
import { PipelinePreview } from "./PipelinePreview";
import { PipelineReadme } from "./PipelineReadme";
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
  let content = null;

  switch (selectedTab) {
    case "api": {
      content = <PipelineApi pipeline={pipeline} releases={releases} />;

      break;
    }
    case "versions": {
      content = (
        <PipelineVersions
          pipeline={pipeline}
          releases={releases}
          isReady={isReady}
        />
      );

      break;
    }
    case "settings": {
      if (pipeline?.permission.canEdit) {
        content = <PipelineSettings pipeline={pipeline} onUpdate={onUpdate} />;
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
    /* case "runs": {
      content = <PipelineRuns pipeline={pipeline} />;

      break;
    } */
    case "playground":
    default: {
      content = <PipelinePlayground pipeline={pipeline} releases={releases} />;
    }
  }

  return (
    <div className="w-full pt-8 flex-1 flex flex-col">
      {pipeline ? (
        content
      ) : (
        <LoadingSpin className="m-none !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
