import { FC } from "react";
import cn from "clsx";
import { AsyncIcon, SyncIcon } from "@instill-ai/design-system";
import { Mode } from "@/types/general";

export type ModeCellProps = {
  width: string;
  mode: Mode;
};

const ModeCell: FC<ModeCellProps> = ({ width, mode }) => {
  const modeIcon = () => {
    if (mode === "async") {
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
    <td>
      <div className={cn("flex gap-x-2 px-2 py-3", width)}>
        {modeIcon}
        <p className="instill-text-body text-instillGrey90">
          {mode === "async" ? "Async" : "Sync"}
        </p>
      </div>
    </td>
  );
};

export default ModeCell;
