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
        <StatusErrorIcon
          color="fill-instillRed"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
    case "on":
      statusIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
    case "off":
      statusIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
  }

  return statusIcon;
};

export default StatusIndicator;
