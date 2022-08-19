import { FC } from "react";
import cn from "clsx";
import { getHumanReadableStringFromTime } from "@/utils/timeUtils";
import { Nullable, State } from "@/types/general";
import CellBase, { CellBaseProps } from "../CellBase";
import Link from "next/link";
import StateIcon from "../../StateIcon";

export type NameCellProps = {
  state: State;
  width: string;
  updatedAt: string;
  name: string;
  link: Nullable<string>;
  lineClamp: Nullable<string>;
  displayUpdateTime: boolean;
  displayStateIndicator: boolean;
} & CellBaseProps;

const NameCell: FC<NameCellProps> = ({
  state,
  width,
  updatedAt,
  name,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  link,
  lineClamp,
  displayUpdateTime,
  displayStateIndicator,
}) => {
  const time = getHumanReadableStringFromTime(
    updatedAt,
    new Date(Date.now()).toUTCString()
  );

  const CellItem = () => (
    <div className={cn("flex flex-row gap-x-2.5", width)}>
      <div
        className={cn("flex", displayStateIndicator ? "h-8 w-8" : "h-4 w-4")}
      >
        {displayStateIndicator ? (
          <StateIcon
            state={state}
            width="w-[18px]"
            height="h-[18px]"
            position="m-auto"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className={cn("text-instill-h3", lineClamp)}>{name}</h3>
        {displayUpdateTime ? (
          <p className="text-instillGrey50 text-instill-small">{`last update at ${time}`}</p>
        ) : null}
      </div>
    </div>
  );

  return (
    <CellBase
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
    >
      {link ? (
        <Link href={link}>
          <a>
            <CellItem />
          </a>
        </Link>
      ) : (
        <CellItem />
      )}
    </CellBase>
  );
};

export default NameCell;
