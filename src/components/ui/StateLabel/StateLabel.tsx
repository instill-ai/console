import { FC, memo, ReactElement } from "react";
import cn from "clsx";

import { Nullable, State } from "@/types/general";
import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";

export type StateLabelProps = {
  state: Nullable<State>;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  paddingX: string;
  paddingY: string;
};

const StateLabel: FC<StateLabelProps> = ({
  enableIcon,
  enableBgColor,
  iconHeight,
  iconWidth,
  iconPosition,
  state,
  paddingX,
  paddingY,
}) => {
  let stateIcon: ReactElement;
  let stateLabelName: string;
  let textColor: string;
  let bgColor: string;

  switch (state) {
    case "STATE_ERROR":
      textColor = "text-instillRed";
      bgColor = "bg-instillRed10";
      stateLabelName = "Error";
      stateIcon = (
        <StatusErrorIcon
          color="fill-instillRed"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_ACTIVE":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Active";
      stateIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_ONLINE":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Online";
      stateIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_CONNECTED":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Connected";
      stateIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_OFFLINE":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Offline";
      stateIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_INACTIVE":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Inactive";
      stateIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "STATE_DISCONNECTED":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Disconnected";
      stateIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    default:
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Not specific";
      stateIcon = (
        <StatusOffIcon
          color="fill-instillGrey50"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
  }

  return (
    <div
      className={cn(
        "flex flex-row gap-x-[5px]",
        paddingX,
        paddingY,
        enableBgColor ? bgColor : ""
      )}
    >
      {enableIcon ? stateIcon : null}
      <span className={cn("my-auto text-instill-small", textColor)}>
        {stateLabelName}
      </span>
    </div>
  );
};

export default memo(StateLabel);
