import { FC } from "react";
import cn from "clsx";
import StatusIndicator from "../../StatusIndicator";
import { getHumanReadableStringFromTime } from "@/utils/timeUtils";
import { Status } from "@/types/general";

export type NameCellProps = {
  status: Status;
  width: string;
  updatedAt: string;
  name: string;
};

const NameCell: FC<NameCellProps> = ({ status, width, updatedAt, name }) => {
  const time = getHumanReadableStringFromTime(updatedAt, Date.now());

  return (
    <td>
      <div className={cn("flex flex-row gap-x-[5px]", width)}>
        <div className="flex h-8 w-8">
          <StatusIndicator
            status={status}
            width="w-[18px]"
            height="h-[18px]"
            position="m-auto"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <h3 className="instill-text-h3">{name}</h3>
          <p className="instill-text-small text-instillGrey50">{`last sync ${time}`}</p>
        </div>
      </div>
    </td>
  );
};

export default NameCell;
