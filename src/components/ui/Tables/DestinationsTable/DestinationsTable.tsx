import { FC } from "react";

import {
  ConnectionTypeCell,
  ConnectorTableHead,
  DestinationTablePlaceholder,
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
} from "@/components/ui";
import type { DestinationTablePlaceholderProps } from "@/components/ui";
import { DestinationWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useStateOverviewCounts } from "@/hooks/useStateOverviewCounts";

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
      <ConnectorTableHead
        definition="destination"
        onlineCounts={stateOverviewCounts?.online || 0}
        offlineCounts={stateOverviewCounts?.offline || 0}
        errorCounts={stateOverviewCounts?.error || 0}
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
