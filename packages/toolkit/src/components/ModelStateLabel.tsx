"use client";

import type { ModelState } from "instill-sdk";
import { cn } from "@instill-ai/design-system";
import type { Nullable } from "../lib";

export type ModelStateLabelProps = {
  state?: Nullable<ModelState>;
  className?: string;
  hardware?: Nullable<string>;
};

export const ModelStateLabel = ({
  state,
  className,
  hardware,
}: ModelStateLabelProps) => {
  if (!state) {
    return null;
  }

  let stateLabelName: string;
  let textColor: string;
  let bgColor: string;
  let indicatorColor: string;

  switch (state) {
    case "STATE_ACTIVE":
    case "STATE_SCALING_DOWN":
    case "STATE_STARTING":
    case "STATE_IDLE": {
      textColor = "text-semantic-success-hover";
      bgColor = "bg-semantic-success-bg";
      stateLabelName = "Your request is being processed, please hold on.";
      indicatorColor = "bg-semantic-success-default";
      break;
    }
    case "STATE_OFFLINE": {
      textColor = "text-semantic-fg-on-default";
      bgColor = "bg-semantic-bg-secondary-alt-primary";
      stateLabelName = "Model deployment takes time. Credits won't be consumed during this period. Please wait.";
      indicatorColor = "bg-semantic-fg-on-default";
      break;
    }
    case "STATE_SCALING_UP": {
      textColor = "text-semantic-warning-hover";
      bgColor = "bg-semantic-warning-bg";
      stateLabelName = `The requested ${hardware ? hardware : "compute resource"} is being provisioned, please wait.`;
      indicatorColor = "bg-semantic-warning-default";
      break;
    }
    case "STATE_ERROR": {
      textColor = "text-semantic-error-hover";
      bgColor = "bg-semantic-error-bg";
      stateLabelName = "Error";
      indicatorColor = "bg-semantic-error-default";
      break;
    }
    case "STATE_UNSPECIFIED":
    default: {
      textColor = "text-semantic-error-hover";
      bgColor = "bg-semantic-error-bg";
      stateLabelName = "Unspecified";
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