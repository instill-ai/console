import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { FC, memo, ReactElement } from "react";
import { State } from "types/general";

export type StateIndicatorProps = {
  state: State;
  width: string;
  height: string;
  position: string;
};

const StateIndicator: FC<StateIndicatorProps> = ({
  state,
  width,
  height,
  position,
}) => {
  let statusIcon: ReactElement;

  switch (state) {
    case "STATE_ERROR":
      statusIcon = (
        <StatusErrorIcon
          color="fill-instillRed"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
    case "STATE_ACTIVE":
    case "STATE_ONLINE":
    case "STATE_CONNECTED":
      statusIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
    case "STATE_OFFLINE":
    case "STATE_INACTIVE":
    case "STATE_DISCONNECTED":
      statusIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={width}
          height={height}
          position={position}
        />
      );
      break;
    default:
      statusIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={width}
          height={height}
          position={position}
        />
      );
  }

  return statusIcon;
};

export default memo(StateIndicator);
