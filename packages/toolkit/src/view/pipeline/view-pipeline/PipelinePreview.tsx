"use client";

import type { Pipeline, PipelineRelease } from "instill-sdk";
import * as React from "react";
import { useSearchParams } from "next/navigation";

import { Flow } from "../../recipe-editor/flow";
import { PreviewEmptyView } from "../../recipe-editor/PreviewEmptyView";

export type PipelinePreviewProps = {
  pipeline?: Pipeline;
  releases: PipelineRelease[];
};

export const PipelinePreview = ({
  pipeline,
  releases,
}: PipelinePreviewProps) => {
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

    return releases.find((item) => item.id === currentVersion) || null;
  }, [releases, currentVersion]);

  return (
    <div
      className="h-full w-full"
      ref={onMount}
      style={{
        height: `calc(100vh - ${topOffset + 32}px)`,
      }}
    >
      {pipeline ? (
        <Flow
          pipelineId={pipeline?.id ?? null}
          recipe={
            activeRelease ? activeRelease?.recipe : (pipeline?.recipe ?? null)
          }
          pipelineMetadata={
            activeRelease
              ? activeRelease?.metadata
              : (pipeline?.metadata ?? null)
          }
          demoMode={true}
        />
      ) : (
        <PreviewEmptyView />
      )}
    </div>
  );
};
