"use client";

import cn from "clsx";

import type { Nullable, ResourceState } from "../lib";
import { StateIcon } from "./StateIcon";

export type StateLabelProps = {
  state: ResourceState;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: Nullable<string>;
  className?: string;
};

export const StateLabel = ({
  enableIcon,
  enableBgColor,
  iconHeight,
  iconWidth,
  iconPosition,
  state,
  className,
}: StateLabelProps) => {
  let stateLabelName: string;
  let textColor: string;
  let bgColor: string;

  switch (state) {
    case "STATE_ERROR":
      textColor = "text-instillRed";
      bgColor = "bg-instillRed10";
      stateLabelName = "Error";
      break;
    case "STATE_ACTIVE":
      textColor = "text-semantic-success-default";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Active";
      break;
    case "STATE_OFFLINE":
      textColor = "text-semantic-node-connector-on";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Offline";
      break;
    case "STATE_INACTIVE":
      textColor = "text-semantic-node-connector-on";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Inactive";
      break;
    case "STATE_UNSPECIFIED":
      textColor = "text-semantic-node-connector-on";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Starting";
      break;
    case "STATE_SCALING":
      textColor = "text-semantic-node-connector-on";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Scaling";
      break;
    case "STATE_IDLE":
      textColor = "text-semantic-success-default";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Idle";
      break;
    default:
      textColor = "text-semantic-node-connector-on";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Unspecified";
  }

  return (
    <div
      className={cn(
        "flex flex-row gap-x-2 p-1",
        enableBgColor ? bgColor : "",
        className
      )}
      data-testid="state-label"
    >
      {enableIcon ? (
        <StateIcon
          state={state}
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      ) : null}
      <span className={cn("text-instill-small my-auto", textColor)}>
        {stateLabelName}
      </span>
    </div>
  );
};
