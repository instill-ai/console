import { FC } from "react";
import TableHeadBase, { Item } from "../TableHeadBase";

const PipelineOverviewTableHead: FC = () => {
  const getHeadItem = (name: string) => {
    return (
      <div className="flex flex-row gap-x-[15px]">
        <div className="my-auto text-instillGrey90 text-instill-body">
          {name}
        </div>
      </div>
    );
  };

  const items: Item[] = [
    {
      key: "pipeline-source",
      item: getHeadItem("Source"),
    },
    {
      key: "pipeline-models",
      item: getHeadItem("Model instances"),
    },
    {
      key: "pipeline-destination",
      item: getHeadItem("Destination"),
    },
  ];

  return (
    <TableHeadBase
      bgColor="bg-instillGrey05"
      borderColor="border-instillGrey20"
      items={items}
    />
  );
};

export default PipelineOverviewTableHead;
