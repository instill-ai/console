import { LoadingSpin } from "../../../components";
import { Nullable, Pipeline, PipelineRelease } from "../../../lib";
import { PipelineTabNames } from "../../../server";
import { PipelinePlayground } from "./PipelinePlayground";
import { PipelinePreview } from "./PipelinePreview";
import { PipelineReadme } from "./PipelineReadme";

export type PipelineContentViewerProps = {
  selectedTab: PipelineTabNames;
  pipeline?: Pipeline;
  onUpdate: () => void;
  activeRelease: Nullable<PipelineRelease>;
};

export const PipelineContentViewer = ({
  selectedTab,
  pipeline,
  onUpdate,
  activeRelease,
}: PipelineContentViewerProps) => {
  let content = null;

  switch (selectedTab) {
    case "api": {
      //content = <PipelineApi pipeline={pipeline} />;

      break;
    }
    case "versions": {
      //content = <PipelineVersions pipeline={pipeline} />

      break;
    }
    case "settings": {
      if (pipeline?.permission.canEdit) {
        //content = <PipelineSettingsEditForm pipeline={pipeline} onUpdate={onUpdate} />;
      }

      break;
    }
    case "readme": {
      content = <PipelineReadme pipeline={pipeline} onUpdate={onUpdate} />;

      break;
    }
    case "preview": {
      content = <PipelinePreview pipeline={pipeline} activeRelease={activeRelease} />;

      break;
    }
    case "runs": {
      //content = <PipelineRuns pipeline={pipeline} onUpdate={onUpdate} />;

      break;
    }
    case "playground":
    default: {
      content = <PipelinePlayground currentVersion={activeRelease?.id || null} />;
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl pt-8">
      {pipeline ? (
        content
      ) : (
        <LoadingSpin className="m-none !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
