import { FC, ReactElement } from "react";
import cn from "clsx";

import { Mode } from "@/types/general";
import { AsyncIcon } from "@instill-ai/design-system";

export type ModelLabelProps = {
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

const ModelLabel: FC<ModelLabelProps> = ({
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
  let statusIcon: ReactElement | null;

  switch (mode) {
    case "async": {
      bgColor = "bg-instillYellow30";
      textColor = "text-instillYellow50";
      statusIcon = (
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
      statusIcon = (
        <AsyncIcon
          color="fill-instillWarmOrange"
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
      statusIcon = null;
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
      {enableIcon ? statusIcon : null}
      <span className={cn("instill-text-small my-auto", textColor)}>
        {label}
      </span>
    </div>
  );
};

export default ModelLabel;
