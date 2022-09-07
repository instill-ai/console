import { FC, useMemo } from "react";

import {
  ConnectionTypeCell,
  DestinationTablePlaceholder,
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
  TableHeadItem,
  TableHead,
} from "@/components/ui";
import type { DestinationTablePlaceholderProps } from "@/components/ui";
import { DestinationWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useStateOverviewCounts } from "@/hooks/useStateOverviewCounts";
import StateOverview from "../../StateOverview";

export type DestinationsTableProps = {
  destinations: DestinationWithPipelines[];
  isLoading: boolean;
  marginBottom: Nullable<string>;
  enablePlaceholderCreateButton: DestinationTablePlaceholderProps["enablePlaceholderCreateButton"];
};

const DestinationsTable: FC<DestinationsTableProps> = ({
  destinations,
  isLoading,
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const stateOverviewCounts = useStateOverviewCounts(
    isLoading ? null : destinations
  );

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

  if (isLoading) {
    return <TableLoadingProgress marginBottom={marginBottom} />;
  }

  if (destinations.length === 0) {
    return (
      <DestinationTablePlaceholder
        enablePlaceholderCreateButton={enablePlaceholderCreateButton}
        marginBottom={marginBottom}
      />
    );
  }

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
      <TableBody>
        {destinations.map((destination) => (
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
              connectorDefinition={destination.destination_connector_definition}
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
    </TableContainer>
  );
};

export default DestinationsTable;
