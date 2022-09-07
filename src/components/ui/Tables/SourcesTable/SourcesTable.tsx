import { FC } from "react";

import {
  ConnectionTypeCell,
  ConnectorTableHead,
  InstanceCell,
  NameCell,
  SourceTablePlaceholder,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
} from "@/components/ui";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import type { SourceTablePlaceholderProps } from "@/components/ui";
import { useStateOverviewCounts } from "@/hooks/useStateOverviewCounts";

export type SourcesTableProps = {
  sources: SourceWithPipelines[];
  isLoadingSources: boolean;
  marginBottom: Nullable<string>;
  enablePlaceholderCreateButton: SourceTablePlaceholderProps["enablePlaceholderCreateButton"];
};

const SourcesTable: FC<SourcesTableProps> = ({
  sources,
  isLoadingSources,
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const stateOverviewCounts = useStateOverviewCounts(
    isLoadingSources ? null : sources
  );

  if (isLoadingSources) {
    return <TableLoadingProgress marginBottom={marginBottom} />;
  }

  if (sources.length === 0) {
    return (
      <SourceTablePlaceholder
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
        definition="source"
        onlineCounts={stateOverviewCounts?.online || 0}
        offlineCounts={stateOverviewCounts?.offline || 0}
        errorCounts={stateOverviewCounts?.error || 0}
      />
      <TableBody>
        {sources.map((source) => (
          <TableRow
            bgColor="bg-white"
            borderColor="border-instillGrey20"
            key={source.name}
          >
            <NameCell
              name={source.id}
              width="w-[234px]"
              state="STATE_ONLINE"
              updatedAt={source.connector.update_time}
              padding="py-5 pl-5"
              link={`/sources/${source.id}`}
              lineClamp="line-clamp-1"
              displayUpdateTime={true}
              displayStateIndicator={true}
            />
            <ConnectionTypeCell
              connectorDefinition={source.source_connector_definition}
              connectorName={source.id}
              cellType="shrink"
              width="w-[234px]"
              padding="py-5"
            />
            <InstanceCell
              cellType="expand"
              width="w-80"
              type="pipeline"
              padding="py-5 pr-[15px]"
              instances={source.pipelines.map((e) => {
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

export default SourcesTable;
