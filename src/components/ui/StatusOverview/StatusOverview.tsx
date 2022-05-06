import { FC, ReactNode } from "react";
import StatusIndicator from "../StatusIndicator";

export type StatusOverviewProps = {
  errorCounts: number;
  onlineCounts: number;
  offlineCounts: number;
};

const StatusOverview: FC<StatusOverviewProps> = ({
  errorCounts,
  onlineCounts,
  offlineCounts,
}) => {
  const getStatusItem = (icon: ReactNode, counts: number) => {
    return (
      <div className="flex flex-row gap-x-[5px] py-[3px] pl-[3px] pr-[10px]">
        {icon}
        <p className="instill-text-body text-black">{counts}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      {onlineCounts
        ? getStatusItem(
            <StatusIndicator
              status="on"
              width="w-3"
              height="h-3"
              position="my-auto"
            />,
            onlineCounts
          )
        : null}
      {errorCounts
        ? getStatusItem(
            <StatusIndicator
              status="error"
              width="w-3"
              height="h-3"
              position="my-auto"
            />,
            errorCounts
          )
        : null}
      {offlineCounts
        ? getStatusItem(
            <StatusIndicator
              status="off"
              width="w-3"
              height="h-3"
              position="my-auto"
            />,
            offlineCounts
          )
        : null}
    </div>
  );
};

export default StatusOverview;
