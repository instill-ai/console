import { FC, memo, ReactNode } from "react";
import StateIndicator from "../StateIndicator";

export type StateOverviewProps = {
  errorCounts: number;
  onlineCounts: number;
  offlineCounts: number;
};

const StateOverview: FC<StateOverviewProps> = ({
  errorCounts,
  onlineCounts,
  offlineCounts,
}) => {
  const getStateItem = (icon: ReactNode, counts: number) => {
    return (
      <div className="flex flex-row gap-x-[5px] py-[3px] pl-[3px] pr-[10px]">
        {icon}
        <p className="instill-text-body text-black">{counts}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      {getStateItem(
        <StateIndicator
          state="STATE_ONLINE"
          width="w-3"
          height="h-3"
          position="my-auto"
        />,
        onlineCounts
      )}
      {getStateItem(
        <StateIndicator
          state="STATE_ERROR"
          width="w-3"
          height="h-3"
          position="my-auto"
        />,
        errorCounts
      )}
      {getStateItem(
        <StateIndicator
          state="STATE_OFFLINE"
          width="w-3"
          height="h-3"
          position="my-auto"
        />,
        offlineCounts
      )}
    </div>
  );
};

export default memo(StateOverview);
