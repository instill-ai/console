import { FC, ReactElement } from "react";
import cn from "clsx";
import { AsyncIcon, SyncIcon } from "@instill-ai/design-system";

import CellBase, { CellBaseProps } from "../CellBase";
import { PipelineMode } from "@/lib/instill";

export type ModeCellProps = CellBaseProps & {
  width: string;
  mode: PipelineMode;
};

const ModeCell: FC<ModeCellProps> = ({ width, mode, padding }) => {
  let modeIcon: ReactElement;
  const iconWidth = "w-5";
  const iconHeight = "h-5";
  const iconPosition = "my-auto";

  switch (mode) {
    case "MODE_ASYNC":
      modeIcon = (
        <AsyncIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color="fill-[#FF8A00]"
        />
      );
      break;

    case "MODE_SYNC":
      modeIcon = (
        <SyncIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color="fill-instillNeonBlue"
        />
      );
      break;

    default:
      modeIcon = <div className={cn(iconWidth, iconHeight)} />;
      break;
  }

  return (
    <CellBase padding={padding}>
      <div className={cn("flex gap-x-[5px] mr-auto", width)}>
        {modeIcon}
        <p className="text-instillGrey90 text-instill-body">
          {mode === "MODE_ASYNC" ? "Async" : "Sync"}
        </p>
      </div>
    </CellBase>
  );
};

export default ModeCell;
