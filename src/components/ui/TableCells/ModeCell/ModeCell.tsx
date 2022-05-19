import { FC } from "react";
import cn from "clsx";
import { AsyncIcon, SyncIcon } from "@instill-ai/design-system";

import CellBase, { CellBaseProps } from "../CellBase";
import { PipelineMode } from "@/lib/instill";

export type ModeCellProps = CellBaseProps & {
  width: string;
  mode: PipelineMode;
};

const ModeCell: FC<ModeCellProps> = ({
  width,
  mode,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
}) => {
  const getModeIcon = () => {
    if (mode === "MODE_ASYNC") {
      return (
        <AsyncIcon
          width="w-5"
          height="h-5"
          color="fill-[#FF8A00]"
          position="my-auto"
        />
      );
    }
    return (
      <SyncIcon
        width="w-5"
        height="h-5"
        color="fill-instillNeonBlue"
        position="my-auto"
      />
    );
  };

  return (
    <CellBase
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
    >
      <div className={cn("flex gap-x-2 px-2 py-3", width)}>
        {getModeIcon()}
        <p className="instill-text-body text-instillGrey90">
          {mode === "MODE_ASYNC" ? "Async" : "Sync"}
        </p>
      </div>
    </CellBase>
  );
};

export default ModeCell;
