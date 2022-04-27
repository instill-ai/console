import { FC, ReactNode } from "react";
import cn from "clsx";
import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { getHumanReadableStringFromTime } from "utils";

export type NameCellProps = {
  status: "on" | "off" | "error";
  width: string;
  updatedAt: string;
  name: string;
};

const NameCell: FC<NameCellProps> = ({ status, width, updatedAt, name }) => {
  let statusIcon: ReactNode;

  const time = getHumanReadableStringFromTime(updatedAt, Date.now());

  switch (status) {
    case "error":
      statusIcon = (
        <StatusErrorIcon
          width="w-[18px]"
          height="h-[18px]"
          position="mb-auto"
        />
      );
      break;
    case "on":
      statusIcon = (
        <StatusOnIcon width="w-[18px]" height="h-[18px]" position="mb-auto" />
      );
      break;
    case "off":
      statusIcon = (
        <StatusOffIcon width="w-[18px]" height="h-[18px]" position="mb-auto" />
      );
      break;
  }

  return (
    <div className={cn("flex flex-row", width)}>
      {statusIcon}
      <div className="flex flex-col gap-y-2">
        <h3 className="instill-text-h3">{name}</h3>
        <p className="instill-text-small text-instillGrey50">{`last sync ${time}`}</p>
      </div>
    </div>
  );
};

export default NameCell;
