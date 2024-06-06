"use client";

import cn from "clsx";
import { Tag } from "@instill-ai/design-system";
import { ReactElement } from "react";
import { Nullable, PipelineTriggerStatus, ResourceState } from "../../lib";

export type GeneralStateCellProps = {
  state: ResourceState | PipelineTriggerStatus;
  width: Nullable<string>;
  padding: string;
  label?: string;
};

export const GeneralStateCell = ({
  state,
  width,
  padding,
  label,
}: GeneralStateCellProps) => {
  let element: Nullable<ReactElement> = null;

  switch (state) {
    case "STATE_DELETED":
    case "STATE_ERROR":
    case "STATUS_ERRORED":
      element = (
        <Tag variant="lightRed" size="sm">
          {label || "Error"}
        </Tag>
      );
      break;

    case "STATE_ACTIVE":
    case "STATUS_COMPLETED":
      element = (
        <Tag variant="lightGreen" size="sm">
          {label || "Active"}
        </Tag>
      );
      break;

    case "STATE_INACTIVE":
    case "STATE_OFFLINE":
      element = (
        <Tag variant="default" size="sm">
          {label || "Inactive"}
        </Tag>
      );
      break;

    default:
      element = (
        <Tag variant="default" size="sm">
          Unspecific
        </Tag>
      );
  }

  return <div className={cn("flex flex-row", width, padding)}>{element}</div>;
};
