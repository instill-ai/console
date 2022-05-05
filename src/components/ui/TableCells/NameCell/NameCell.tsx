import { FC } from "react";
import cn from "clsx";
import StatusIndicator from "../../StatusIndicator";
import { getHumanReadableStringFromTime } from "@/utils/timeUtils";

export type NameCellProps = {
  status: "on" | "off" | "error";
  width: string;
  updatedAt: string;
  name: string;
};

const NameCell: FC<NameCellProps> = ({ status, width, updatedAt, name }) => {
  const time = getHumanReadableStringFromTime(updatedAt, Date.now());

  return (
    <div className={cn("flex flex-row", width)}>
      <StatusIndicator
        status={status}
        width="w-[18px]"
        height="h-[18px]"
        position="mb-auto"
      />
      <div className="flex flex-col gap-y-2">
        <h3 className="instill-text-h3">{name}</h3>
        <p className="instill-text-small text-instillGrey50">{`last sync ${time}`}</p>
      </div>
    </div>
  );
};

export default NameCell;
