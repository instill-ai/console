import { useMemo } from "react";

import {
  ConnectionTypeCell,
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHeadItem,
  TableHead,
} from "@/components/ui";
import { DestinationWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StateOverview } from "../StateOverview";
import { StateOverviewCounts } from "@/hooks/useStateOverviewCounts";

export type DestinationsTableProps = {
  destinationPages: DestinationWithPipelines[][];
  marginBottom: Nullable<string>;
  currentPage: number;
  stateOverviewCounts: Nullable<StateOverviewCounts>;
};

export const DestinationsTable = ({
  destinationPages,
  marginBottom,
  currentPage,
  stateOverviewCounts,
}: DestinationsTableProps) => {
  const tableHeadItems = useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "connector-state-overview-head",
        item: (
          <StateOverview
            errorCounts={stateOverviewCounts?.error || 0}
            offlineCounts={stateOverviewCounts?.offline || 0}
            onlineCounts={stateOverviewCounts?.online || 0}
          />
        ),
      },
      {
        key: "connector-type-head",
        item: "Destination",
      },
      {
        key: "connector-pipelines-head",
        item: "Pipelines",
      },
    ];
  }, [stateOverviewCounts]);

  return (
    <TableContainer
      marginBottom={marginBottom}
      tableLayout="table-auto"
      borderCollapse="border-collapse"
    >
      <TableHead
        borderColor="border-instillGrey20"
        bgColor="bg-instillGrey05"
        items={tableHeadItems}
      />
      {destinationPages.length !== 0 ? (
        <TableBody>
          {destinationPages[currentPage].map((destination) => (
            <TableRow
              bgColor="bg-white"
              borderColor="border-instillGrey20"
              key={destination.name}
            >
              <NameCell
                name={destination.id}
                width="w-[234px]"
                state={destination.connector.state}
                updatedAt={destination.connector.update_time}
                padding="pl-5 py-5"
                link={`/destinations/${destination.id}`}
                lineClamp="line-clamp-1"
                displayUpdateTime={true}
                displayStateIndicator={true}
              />
              <ConnectionTypeCell
                connectorDefinition={
                  destination.destination_connector_definition
                }
                connectorName={destination.id}
                cellType="shrink"
                width="w-[234px]"
                padding="py-5"
              />
              <InstanceCell
                cellType="expand"
                width="w-80"
                type="pipeline"
                padding="py-5 pr-[15px]"
                instances={destination.pipelines.map((e) => {
                  return {
                    name: e.id,
                    state: e.state,
                  };
                })}
              />
            </TableRow>
          ))}
        </TableBody>
      ) : null}
    </TableContainer>
  );
};
