import { FC } from "react";
import cn from "clsx";
import StateIndicator from "../../StateIndicator";
import { getHumanReadableStringFromTime } from "@/utils/timeUtils";
import { Nullable, State } from "@/types/general";
import CellBase, { CellBaseProps } from "../CellBase";
import Link from "next/link";

export type NameCellProps = {
  state: State;
  width: string;
  updatedAt: string;
  name: string;
  link: Nullable<string>;
  lineClamp: Nullable<string>;
  displayUpdateTime: boolean;
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
}) => {
  const time = getHumanReadableStringFromTime(updatedAt, Date.now());

  const CellItem = () => (
    <div className={cn("flex flex-row gap-x-2.5", width)}>
      <div className="flex h-8 w-8">
        <StateIndicator
          state={state}
          width="w-[18px]"
          height="h-[18px]"
          position="m-auto"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className={cn("text-instill-h3", lineClamp)}>{name}</h3>
        {displayUpdateTime ? (
          <p className="instill-text-small text-instillGrey50">{`last sync ${time}`}</p>
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
