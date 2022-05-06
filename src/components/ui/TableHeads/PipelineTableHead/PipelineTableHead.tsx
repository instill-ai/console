import { FC } from "react";
import StatusOverview from "../../StatusOverview";
import TableHeadBase, { Item } from "../TableHeadBase";

export type PipelineTableHeadProps = {
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const PipelineTableHead: FC<PipelineTableHeadProps> = ({
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const pipelineHeadItems: Item[] = [
    {
      key: "pipeline-status-overview-head",
      item: (
        <StatusOverview
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
    <TableHeadBase bgColor="border-instillGrey05" items={pipelineHeadItems} />
  );
};

export default PipelineTableHead;
