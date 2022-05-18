import { State } from "@/types/general";
import { FC } from "react";
import StatusIndicator from "../../StatusIndicator";
import StateLabel from "../../StateLabel";
import TableHeadBase, { Item } from "../TableHeadBase";

export type PipelineOverviewTableHeadProps = {
  sourceStatus: State;
  modelStatus: State;
  destinationStatus: State;
};

const PipelineOverviewTableHead: FC<PipelineOverviewTableHeadProps> = ({
  sourceStatus,
  modelStatus,
  destinationStatus,
}) => {
  const getHeadItem = (name: string, state: State) => {
    return (
      <div className="flex flex-row gap-x-[15px]">
        <div className="instill-text-body my-auto text-instillGrey90">
          {name}
        </div>
        <StateLabel
          enableBgColor={true}
          enableIcon={true}
          state={state}
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
