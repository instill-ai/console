import { FC, ReactElement } from "react";
import cn from "clsx";
import { AsyncIcon, SyncIcon } from "@instill-ai/design-system";

import { PipelineMode } from "@/lib/instill";

export type PipelineModeLabelProps = {
  mode: PipelineMode;
  enableIcon: boolean;
  enableBgColor: boolean;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  paddingX: string;
  paddingY: string;
};

const PipelineModeLabel: FC<PipelineModeLabelProps> = ({
  mode,
  enableBgColor,
  enableIcon,
  iconWidth,
  iconHeight,
  iconPosition,
  paddingX,
  paddingY,
}) => {
  let bgColor: string;
  let textColor: string;
  let modeIcon: ReactElement | null;
  let label: string;

  switch (mode) {
    case "MODE_ASYNC": {
      bgColor = "bg-instillYellow30";
      textColor = "text-instillYellow50";
      label = "Async";
      modeIcon = (
        <AsyncIcon
          color="fill-instillWarmOrange"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    }
    case "MODE_SYNC": {
      bgColor = "bg-[#EDEDFF]";
      textColor = "text-instillNeonBlue";
      label = "Sync";
      modeIcon = (
        <SyncIcon
          color="fill-instillNeonBlue"
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    }
    default: {
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      label = "";
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

export default PipelineModeLabel;
