import { Status } from "@/types/general";
import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { FC, memo, ReactElement } from "react";
import cn from "clsx";

export type StatusLabelProps = {
  status: Status;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  paddingX: string;
  paddingY: string;
  label: string;
};

const StatusLabel: FC<StatusLabelProps> = ({
  enableIcon,
  enableBgColor,
  iconHeight,
  iconWidth,
  iconPosition,
  status,
  paddingX,
  paddingY,
  label,
}) => {
  let statusIcon: ReactElement;
  let textColor: string;
  let bgColor: string;

  switch (status) {
    case "error":
      textColor = "text-instillRed";
      bgColor = "bg-instillRed10";
      statusIcon = (
        <StatusErrorIcon
          color="fill-instillRed"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "on":
    case "online":
    case "active":
    case "connected":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      statusIcon = (
        <StatusOnIcon
          color="fill-instillGreen"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "off":
    case "offline":
    case "inactive":
    case "disconnected":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      statusIcon = (
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
      statusIcon = (
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
      {enableIcon ? statusIcon : null}
      <span className={cn("instill-text-small my-auto", textColor)}>
        {label}
      </span>
    </div>
  );
};

export default memo(StatusLabel);
