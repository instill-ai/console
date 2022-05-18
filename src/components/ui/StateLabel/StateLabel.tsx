import { State } from "@/types/general";
import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { FC, memo, ReactElement } from "react";
import cn from "clsx";

export type StateLabelProps = {
  state: State;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  paddingX: string;
  paddingY: string;
  label: string;
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
  label,
}) => {
  let stateIcon: ReactElement;
  let textColor: string;
  let bgColor: string;

  switch (state) {
    case "STATE_ERROR":
      textColor = "text-instillRed";
      bgColor = "bg-instillRed10";
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
    case "STATE_ONLINE":
    case "STATE_CONNECTED":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
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
    case "STATE_INACTIVE":
    case "STATE_DISCONNECTED":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
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
      <span className={cn("instill-text-small my-auto", textColor)}>
        {label}
      </span>
    </div>
  );
};

export default memo(StateLabel);
