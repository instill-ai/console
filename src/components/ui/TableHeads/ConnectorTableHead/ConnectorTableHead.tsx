import { FC } from "react";
import StateOverview from "../../StateOverview";
import TableHeadBase from "../TableHeadBase";

export type ConnectorTableHeadProps = {
  definition: "source" | "destination";
  errorCounts: number;
  offlineCounts: number;
  onlineCounts: number;
};

const ConnectorTableHead: FC<ConnectorTableHeadProps> = ({
  definition,
  errorCounts,
  offlineCounts,
  onlineCounts,
}) => {
  const ConnectorHeadItem = [
    {
      key: "connector-state-overview-head",
      item: (
        <StateOverview
          errorCounts={errorCounts}
          offlineCounts={offlineCounts}
          onlineCounts={onlineCounts}
        />
      ),
    },
    {
      key: "connector-type-head",
      item: definition === "source" ? "Source" : "Destination",
    },
    {
      key: "connector-pipelines-head",
      item: "Pipelines",
    },
  ];

  return (
    <TableHeadBase
      borderColor="border-instillGrey20"
      bgColor="bg-instillGrey05"
      items={ConnectorHeadItem}
    />
  );
};

export default ConnectorTableHead;
