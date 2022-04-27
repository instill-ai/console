import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { FC, ReactElement } from "react";
import { Status } from "types/general";

export type StatusIndicatorProps = {
  status: Status;
  width: string;
  height: string;
  position: string;
};

const StatusIndicator: FC<StatusIndicatorProps> = ({
  status,
  width,
  height,
  position,
}) => {
  let statusIcon: ReactElement;

  switch (status) {
    case "error":
      statusIcon = (
        <StatusErrorIcon width={width} height={height} position={position} />
      );
      break;
    case "on":
      statusIcon = (
        <StatusOnIcon width={width} height={height} position={position} />
      );
      break;
    case "off":
      statusIcon = (
        <StatusOffIcon width={width} height={height} position={position} />
      );
      break;
  }

  return statusIcon;
};

export default StatusIndicator;
