import { FC } from "react";
import StateOverview from "../../StateOverview";
import TableHeadBase, { Item } from "../TableHeadBase";

export type PipelinesTableHeadProps = {
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const PipelinesTableHead: FC<PipelinesTableHeadProps> = ({
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const pipelineHeadItems: Item[] = [
    {
      key: "pipeline-status-overview-head",
      item: (
        <StateOverview
          errorCounts={errorCounts}
          offlineCounts={offlineCounts}
          onlineCounts={onlineCounts}
        />
      ),
    },
    {
      key: "pipeline-mode-head",
      item: "Mode",
    },
    {
      key: "pipeline-source-head",
      item: "Source",
    },
    {
      key: "pipeline-models-head",
      item: "Models",
    },
    {
      key: "pipeline-destination-head",
      item: "Destination",
    },
  ];

  return (
    <TableHeadBase
      borderColor="border-instillGrey20"
      bgColor="bg-instillGrey05"
      items={pipelineHeadItems}
    />
  );
};

export default PipelinesTableHead;
