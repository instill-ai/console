import { FC } from "react";
import cn from "clsx";
import StatusIndicator from "../../StatusIndicator";
import { getHumanReadableStringFromTime } from "@/utils/timeUtils";
import { Status } from "@/types/general";
import CellBase, { CellBaseProps } from "../CellBase";

export type NameCellProps = {
  status: Status;
  width: string;
  updatedAt: string;
  name: string;
} & CellBaseProps;

const NameCell: FC<NameCellProps> = ({
  status,
  width,
  updatedAt,
  name,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
}) => {
  const time = getHumanReadableStringFromTime(updatedAt, Date.now());

  return (
    <CellBase
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
    >
      <div className={cn("flex flex-row gap-x-2.5", width)}>
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
    </CellBase>
  );
};

export default NameCell;
