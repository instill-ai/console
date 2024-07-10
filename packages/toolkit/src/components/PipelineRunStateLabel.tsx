"use client";

import { cn } from "@instill-ai/design-system";
import type { Nullable, PipelineTriggerStatus } from "../lib";

export type PipelineRunStateLabelProps = {
  state?: Nullable<PipelineTriggerStatus>;
  className?: string;
};

export const PipelineRunStateLabel = ({ state, className }: PipelineRunStateLabelProps) => {
  if (!state) {
    return null;
  }

  let stateLabelName: string;
  let textColor: string;
  let bgColor: string;
  let indicatorColor: string;

  switch (state) {
    case "STATUS_COMPLETED": {
      textColor = "text-semantic-success-hover";
      bgColor = "bg-semantic-success-bg";
      stateLabelName = "Completed";
      indicatorColor = "bg-semantic-success-default";
      break;
    }
    case "STATUS_ERRORED": {
      textColor = "text-semantic-error-hover";
      bgColor = "bg-semantic-error-bg";
      stateLabelName = "Errored";
      indicatorColor = "bg-semantic-error-default";
      break;
    }
    case "STATUS_UNSPECIFIED":
    default: {
      textColor = "text-semantic-error-hover";
      bgColor = "bg-semantic-error-bg";
      stateLabelName = "Unknown";
      indicatorColor = "bg-semantic-error-default";
    }
  }

  return (
    <div
      className={cn(
        "flex h-6 flex-row items-center gap-x-2 rounded-full px-2.5 py-1",
        bgColor,
        className,
      )}
      data-testid="state-label"
    >
      <div className={cn("h-[8px] w-[8px] rounded-full", indicatorColor)}></div>
      <span className={cn("product-body-text-3-medium", textColor)}>
        {stateLabelName}
      </span>
    </div>
  );
};
