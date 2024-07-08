import * as React from "react";
import { Nullable, Pipeline, PipelineRelease } from "../../../lib";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder"

export type PipelinePreviewProps = {
  pipeline?: Pipeline;
  activeRelease: Nullable<PipelineRelease>;
}

export const PipelinePreview = ({ pipeline, activeRelease }: PipelinePreviewProps) => {
  const [topOffset, setTopOffset] = React.useState(0);
  const onMount = React.useCallback((node: HTMLHeadingElement) => {
    if (!node) {
      return;
    }

    const boundingRect = node.getBoundingClientRect();

    setTopOffset(boundingRect.top);
  }, []);

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

