import { FC } from "react";

import {
  ConnectionTypeCell,
  ConnectorTableHead,
  DestinationTablePlaceholder,
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableLoadingPlaceholder,
  TableRow,
} from "@/components/ui";
import { DestinationWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type DestinationTableProps = {
  destinations: DestinationWithPipelines[];
  isLoading: boolean;
  marginBottom: Nullable<string>;
};

const DestinationTable: FC<DestinationTableProps> = ({
  destinations,
  isLoading,
  marginBottom,
}) => {
  if (isLoading) {
    return <TableLoadingPlaceholder />;
  }

  if (destinations.length === 0) {
    return <DestinationTablePlaceholder />;
  }

  return (
    <TableContainer
      marginBottom={marginBottom}
      tableLayout="table-auto"
      borderCollapse="border-collapse"
    >
      <ConnectorTableHead
        definition="destination"
        offlineCounts={0}
        onlineCounts={destinations.length}
        errorCounts={0}
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
              state="STATE_ONLINE"
              updatedAt={destination.connector.update_time}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-5"
              paddingRight=""
              link={`/destinations/${destination.id}`}
              lineClamp="line-clamp-1"
              displayUpdateTime={true}
            />
            <ConnectionTypeCell
              definitionName={
                destination.destination_connector_definition
                  .connector_definition.title
              }
              iconDefinition={
                destination.destination_connector_definition
                  .connector_definition.icon
              }
              connectionName={destination.id}
              cellType="shrink"
              width="w-[234px]"
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <InstanceCell
              cellType="expand"
              width="w-80"
              type="pipeline"
              instances={destination.pipelines.map((e) => {
                return {
                  name: e.id,
                  state: e.state,
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight="pr-[15px]"
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default DestinationTable;
