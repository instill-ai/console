import { State } from "@/types/general";
import { FC } from "react";
import StateIndicator from "../../StateIndicator";
import StateLabel from "../../StateLabel";
import TableHeadBase, { Item } from "../TableHeadBase";

export type PipelineOverviewTableHeadProps = {
  sourceState: State;
  modelState: State;
  destinationState: State;
};

const PipelineOverviewTableHead: FC<PipelineOverviewTableHeadProps> = ({
  sourceState,
  modelState,
  destinationState,
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
          label={state}
        />
      </div>
    );
  };

  const items: Item[] = [
    {
      key: "pipeline-source",
      item: getHeadItem("Source", sourceState),
    },
    {
      key: "pipeline-models",
      item: getHeadItem("Models", modelState),
    },
    {
      key: "pipeline-destination",
      item: getHeadItem("Destination", destinationState),
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
