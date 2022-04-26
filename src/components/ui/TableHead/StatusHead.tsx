import {
  StatusErrorIcon,
  StatusOffIcon,
  StatusOnIcon,
} from "@instill-ai/design-system";
import { FC, ReactNode } from "react";

export type StatusHeadProps = {
  errorCounts: number;
  onCounts: number;
  offCounts: number;
};

const StatusHead: FC<StatusHeadProps> = ({
  errorCounts,
  offCounts,
  onCounts,
}) => {
  const getStatusItem = (icon: ReactNode, counts: number) => {
    return (
      <div className="flex flex-row gap-x-[5px] py-[3px] pl-[3px] pr-[10px]">
        {icon}
        <p className="text-instill-body text-black">{counts}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      {onCounts
        ? getStatusItem(
            <StatusOnIcon width="w-3" height="h-3" position="my-auto" />,
            onCounts
          )
        : null}
      {errorCounts
        ? getStatusItem(
            <StatusErrorIcon width="w-3" height="h-3" position="my-auto" />,
            errorCounts
          )
        : null}
      {offCounts
        ? getStatusItem(
            <StatusOffIcon width="w-3" height="h-3" position="my-auto" />,
            offCounts
          )
        : null}
    </div>
  );
};

export default StatusHead;
