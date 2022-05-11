import { Status } from "@/types/general";
import { FC } from "react";
import StatusIndicator from "../../StatusIndicator";
import StatusLabel from "../../StatusLabel";
import TableHeadBase, { Item } from "../TableHeadBase";

export type PipelineOverviewTableHeadProps = {
  sourceStatus: Status;
  modelStatus: Status;
  destinationStatus: Status;
};

const PipelineOverviewTableHead: FC<PipelineOverviewTableHeadProps> = ({
  sourceStatus,
  modelStatus,
  destinationStatus,
}) => {
  const getHeadItem = (name: string, status: Status) => {
    return (
      <div className="flex flex-row gap-x-[15px]">
        <div className="instill-text-body text-instillGrey90 my-auto">
          {name}
        </div>
        <StatusLabel
          enableBgColor={true}
          enableIcon={true}
          status={status}
          paddingX="px-[5px]"
          paddingY="py-[5px]"
          iconHeight="h-3"
          iconWidth="w-3"
          iconPosition="my-auto"
          label={status}
        />
      </div>
    );
  };

  const items: Item[] = [
    {
      key: "pipeline-source",
      item: getHeadItem("Source", sourceStatus),
    },
    {
      key: "pipeline-models",
      item: getHeadItem("Models", modelStatus),
    },
    {
      key: "pipeline-destination",
      item: getHeadItem("Destination", destinationStatus),
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
