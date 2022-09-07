import { memo } from "react";
import cn from "clsx";

import { Nullable, State } from "@/types/general";
import StateIcon from "./StateIcon";

export type StateLabelProps = {
  state: State;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: Nullable<string>;
  paddingX: string;
  paddingY: string;
};

const StateLabel = ({
  enableIcon,
  enableBgColor,
  iconHeight,
  iconWidth,
  iconPosition,
  state,
  paddingX,
  paddingY,
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
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Active";
      break;
    case "STATE_ONLINE":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Online";
      break;
    case "STATE_CONNECTED":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      stateLabelName = "Connected";
      break;
    case "STATE_OFFLINE":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Offline";
      break;
    case "STATE_INACTIVE":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Inactive";
      break;
    case "STATE_DISCONNECTED":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Disconnected";
      break;
    default:
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      stateLabelName = "Unspecified";
  }

  return (
    <div
      className={cn(
        "flex flex-row gap-x-2",
        paddingX,
        paddingY,
        enableBgColor ? bgColor : ""
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
      <span className={cn("my-auto text-instill-small", textColor)}>
        {stateLabelName}
      </span>
    </div>
  );
};

export default memo(StateLabel);
