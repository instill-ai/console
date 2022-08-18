import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { memo, ReactElement } from "react";
import { Nullable, State } from "types/general";

export type StateIconProps = {
  state: State;
  width: string;
  height: string;
  position: Nullable<string>;
};

const StateIcon = ({ state, width, height, position }: StateIconProps) => {
  let icon: ReactElement;

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
    case "STATE_CONNECTED":
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
    case "STATE_DISCONNECTED":
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

export default memo(StateIcon);
