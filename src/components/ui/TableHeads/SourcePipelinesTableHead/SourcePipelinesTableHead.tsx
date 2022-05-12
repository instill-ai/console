import { FC } from "react";
import StatusOverview from "../../StatusOverview";
import TableHeadBase, { Item } from "../TableHeadBase";

export type SourcePipelinesTableHeadProps = {
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const SourcePipelinesTableHead: FC<SourcePipelinesTableHeadProps> = ({
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const pipelineHeadItems: Item[] = [
    {
      key: "pipeline-name-head",
      item: "Pipeline name",
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

export default SourcePipelinesTableHead;
