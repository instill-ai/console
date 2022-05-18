import { FC, ReactElement } from "react";
import cn from "clsx";

import { Mode } from "@/types/general";
import { AsyncIcon, SyncIcon } from "@instill-ai/design-system";

export type ModeLabelProps = {
  mode: Mode;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  paddingX: string;
  paddingY: string;
  label: string;
};

const ModeLabel: FC<ModeLabelProps> = ({
  mode,
  enableBgColor,
  enableIcon,
  iconWidth,
  iconHeight,
  iconPosition,
  paddingX,
  paddingY,
  label,
}) => {
  let bgColor: string;
  let textColor: string;
  let modeIcon: ReactElement | null;

  switch (mode) {
    case "async": {
      bgColor = "bg-instillYellow30";
      textColor = "text-instillYellow50";
      modeIcon = (
        <AsyncIcon
          color="fill-instillWarmOrange"
          width="w-[18px]"
          height="h-[18px]"
          position="my-auto"
        />
      );
      break;
    }
    case "sync": {
      bgColor = "bg-[#EDEDFF]";
      textColor = "text-instillNeonBlue";
      modeIcon = (
        <SyncIcon
          color="fill-instillNeonBlue"
          width="w-[18px]"
          height="h-[18px]"
          position="my-auto"
        />
      );
      break;
    }
    default: {
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      modeIcon = null;
    }
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
      {enableIcon ? modeIcon : null}
      <span className={cn("instill-text-small my-auto", textColor)}>
        {label}
      </span>
    </div>
  );
};

export default ModeLabel;
