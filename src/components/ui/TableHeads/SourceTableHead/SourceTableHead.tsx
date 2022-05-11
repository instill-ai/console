import { FC } from "react";
import StatusOverview from "../../StatusOverview";
import TableHeadBase from "../TableHeadBase";

export type SourceTableHeadProps = {
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const SourceTableHead: FC<SourceTableHeadProps> = ({
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const SourceHeadItem = [
    {
      key: "source-status-overview-head",
      item: (
        <StatusOverview
          errorCounts={errorCounts}
          offlineCounts={offlineCounts}
          onlineCounts={onlineCounts}
        />
      ),
    },
    {
      key: "source-type-head",
      item: "Type",
    },
    {
      key: "source-pipelines-head",
      item: "Pipelines",
    },
  ];

  return (
    <TableHeadBase
      borderColor="border-instillGrey20"
      bgColor="bg-instillGrey05"
      items={SourceHeadItem}
    />
  );
};

export default SourceTableHead;
