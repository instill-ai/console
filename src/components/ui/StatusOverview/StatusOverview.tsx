import { FC, ReactNode } from "react";
import StatusIndicator from "../StatusIndicator";

export type StatusOverviewProps = {
  errorCounts: number;
  onCounts: number;
  offCounts: number;
};

const StatusOverview: FC<StatusOverviewProps> = ({
  errorCounts,
  offCounts,
  onCounts,
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
      {onCounts
        ? getStatusItem(
            <StatusIndicator
              status="on"
              width="w-3"
              height="h-3"
              position="my-auto"
            />,
            onCounts
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
      {offCounts
        ? getStatusItem(
            <StatusIndicator
              status="off"
              width="w-3"
              height="h-3"
              position="my-auto"
            />,
            offCounts
          )
        : null}
    </div>
  );
};

export default StatusOverview;
