"use client";

import type { ModelState } from "instill-sdk";
import cn from "clsx";

import type { Nullable } from "../lib";

export type ModelStateLabelProps = {
  state?: Nullable<ModelState>;
  className?: string;
};

export const ModelStateLabel = ({ state, className }: ModelStateLabelProps) => {
  if (!state) {
    return null;
  }

  let stateLabelName: string;
  let textColor: string;
  let bgColor: string;
  let indicatorColor: string;

  switch (state) {
    case "STATE_ACTIVE": {
      textColor = "text-semantic-success-hover";
      bgColor = "bg-semantic-success-bg";
      stateLabelName = "Active";
      indicatorColor = "bg-semantic-success-default";
      break;
    }
    case "STATE_IDLE": {
      textColor = "text-semantic-fg-primary";
      bgColor = "bg-semantic-bg-base-bg";
      stateLabelName = "Idle";
      indicatorColor = "bg-semantic-success-default";
      break;
    }
    case "STATE_ERROR": {
      textColor = "text-semantic-error-hover";
      bgColor = "bg-semantic-error-bg";
      stateLabelName = "Error";
      indicatorColor = "bg-semantic-error-default";
      break;
    }
    case "STATE_OFFLINE": {
      textColor = "text-semantic-fg-on-default";
      bgColor = "bg-semantic-bg-secondary-alt-primary";
      stateLabelName = "Offline";
      indicatorColor = "bg-semantic-fg-on-default";
      break;
    }
    case "STATE_SCALING_UP": {
      textColor = "text-semantic-warning-hover";
      bgColor = "bg-semantic-warning-bg";
      stateLabelName = "Scaling up";
      indicatorColor = "bg-semantic-warning-default";
      break;
    }
    case "STATE_SCALING_DOWN": {
      textColor = "text-semantic-warning-hover";
      bgColor = "bg-semantic-warning-bg";
      stateLabelName = "Scaling down";
      indicatorColor = "bg-semantic-warning-default";
      break;
    }
    case "STATE_UNSPECIFIED":
    case "STATE_STARTING":
    default: {
      textColor = "text-semantic-fg-primary";
      bgColor = "bg-semantic-base-bg";
      stateLabelName = "Starting";
      indicatorColor = "bg-semantic-success-default";
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
