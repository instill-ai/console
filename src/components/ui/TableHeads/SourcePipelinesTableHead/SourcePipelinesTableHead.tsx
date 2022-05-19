import { FC } from "react";
import TableHeadBase, { Item } from "../TableHeadBase";

const SourcePipelinesTableHead: FC = () => {
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
