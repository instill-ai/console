import { FC } from "react";
import StateOverview from "../../StateOverview";
import TableHeadBase from "../TableHeadBase";

export type ModelTableHeadProps = {
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const ModelTableHead: FC<ModelTableHeadProps> = ({
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const ModelHeadItem = [
    {
      key: "model-state-overview-head",
      item: (
        <StateOverview
          errorCounts={errorCounts}
          offlineCounts={offlineCounts}
          onlineCounts={onlineCounts}
        />
      ),
    },
    {
      key: "model-source-head",
      item: "Source",
    },
    {
      key: "model-instances-head",
      item: "Instances",
    },
  ];

  return (
    <TableHeadBase
      borderColor="border-instillGrey20"
      bgColor="bg-instillGrey05"
      items={ModelHeadItem}
    />
  );
};

export default ModelTableHead;
