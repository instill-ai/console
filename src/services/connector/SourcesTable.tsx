import { FC, useMemo } from "react";

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
        offlineCounts={0}
        onlineCounts={sources.length}
        errorCounts={0}
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
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-5"
              paddingRight=""
              link={`/sources/${source.id}`}
              lineClamp="line-clamp-1"
              displayUpdateTime={true}
            />
            <ConnectionTypeCell
              definitionName={
                source.source_connector_definition.connector_definition.title
              }
              iconDefinition={
                source.source_connector_definition.connector_definition.icon
              }
              connectionName={source.id}
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
              instances={source.pipelines.map((e) => {
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

export default SourcesTable;
