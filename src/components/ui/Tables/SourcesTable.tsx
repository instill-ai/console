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
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StateOverview } from "../StateOverview";
import { StateOverviewCounts } from "@/hooks/useStateOverviewCounts";

export type SourcesTableProps = {
  sourcePages: SourceWithPipelines[][];
  marginBottom: Nullable<string>;
  currentPage: number;
  stateOverviewCounts: Nullable<StateOverviewCounts>;
};

export const SourcesTable = ({
  sourcePages,
  currentPage,
  marginBottom,
  stateOverviewCounts,
}: SourcesTableProps) => {
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
        item: "Source",
      },
      {
        key: "connector-pipelines-head",
        item: "Pipelines",
      },
    ];
  }, [stateOverviewCounts]);

  if (sourcePages.length === 0) {
    return <></>;
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
        {sourcePages[currentPage].map((source) => (
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
