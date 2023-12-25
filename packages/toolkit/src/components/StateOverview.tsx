import { Nullable } from "../lib";
import { StateIcon } from "./StateIcon";

export type StateOverviewProps = {
  errorCounts: number;
  onlineCounts: number;
  offlineCounts: number;
};

export const StateOverview = ({
  errorCounts,
  onlineCounts,
  offlineCounts,
}: StateOverviewProps) => {
  const getItem = (icon: React.ReactNode, counts: Nullable<number>) => {
    return (
      <div className="flex flex-row gap-x-[5px] py-[3px] pl-[3px] pr-[10px]">
        {icon}
        <p className="text-instill-body text-black">{counts}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      {getItem(
        <StateIcon
          state="STATE_ONLINE"
          width="w-3"
          height="h-3"
          position="my-auto"
        />,
        onlineCounts
      )}
      {getItem(
        <StateIcon
          state="STATE_ERROR"
          width="w-3"
          height="h-3"
          position="my-auto"
        />,
        errorCounts
      )}
      {getItem(
        <StateIcon
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
