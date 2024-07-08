import * as React from "react";
import { Pipeline, PipelineRelease } from "../../../lib";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder"
import { useSearchParams } from "next/navigation";

export type PipelinePreviewProps = {
  pipeline?: Pipeline;
  releases: PipelineRelease[];
}

export const PipelinePreview = ({ pipeline, releases }: PipelinePreviewProps) => {
  const searchParams = useSearchParams();
  const currentVersion = searchParams.get("version");
  const [topOffset, setTopOffset] = React.useState(0);
  const onMount = React.useCallback((node: HTMLHeadingElement) => {
    if (!node) {
      return;
    }

    const boundingRect = node.getBoundingClientRect();

    setTopOffset(boundingRect.top);
  }, []);

  const activeRelease = React.useMemo(() => {
    if (!releases.length) {
      return null;
    }

    return releases.find(item => item.id === currentVersion) || null;
  }, [releases, currentVersion])

  return (
    <ReadOnlyPipelineBuilder
      ref={onMount}
      pipelineName={pipeline?.name || null}
      recipe={
        activeRelease
          ? activeRelease.recipe
          : pipeline?.recipe ?? null
      }
      metadata={
        activeRelease
          ? activeRelease.metadata
          : pipeline?.metadata ?? null
      }
      className="min-h-80 w-full"
      style={{
        height: `calc(100vh - ${topOffset + 32}px)`,
      }}
    />
  );
}

