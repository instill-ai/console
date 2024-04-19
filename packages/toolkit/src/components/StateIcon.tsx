"use client";

import * as React from "react";
import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import type { Nullable, ResourceState } from "../lib";

export type StateIconProps = {
  state: ResourceState;
  width: string;
  height: string;
  position: Nullable<string>;
};

export const StateIcon = ({
  state,
  width,
  height,
  position,
}: StateIconProps) => {
  let icon: React.ReactElement;

  switch (state) {
    case "STATE_ERROR":
      icon = (
        <StatusErrorIcon
          color="fill-instillRed"
          width={width}
          height={height}
          position={position || undefined}
        />
      );
      break;
    case "STATE_ACTIVE":
    case "STATE_ONLINE":
      icon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={width}
          height={height}
          position={position || undefined}
        />
      );
      break;
    case "STATE_OFFLINE":
    case "STATE_INACTIVE":
      icon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={width}
          height={height}
          position={position || undefined}
        />
      );
      break;
    default:
      icon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={width}
          height={height}
          position={position || undefined}
        />
      );
  }

  return icon;
};
