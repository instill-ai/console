import { useMemo, useState } from "react";

import {
  ConnectionTypeCell,
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHeadItem,
  TableHead,
  TableLoadingProgress,
  SourceTablePlaceholder,
} from "@/components/ui";
import { SourceWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StateOverview } from "../StateOverview";
import { PaginationListContainer } from "../PaginationListContainer";
import { useSearchedResources } from "@/hooks/useSearchedResources";
import { useStateOverviewCounts } from "@/hooks";
import { chunk, env } from "@/utils";

export type SourcesTableProps = {
  sources: Nullable<SourceWithPipelines[]>;
  marginBottom: Nullable<string>;
};

export const SourcesTable = ({ sources, marginBottom }: SourcesTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const searchedSources = useSearchedResources({
    resources: sources || null,
    searchTerm,
  });

  const searchedPipelinePages = useMemo(() => {
    return chunk(searchedSources, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [searchedSources]);

  const stateOverviewCounts = useStateOverviewCounts(searchedSources);

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

  return (
    <PaginationListContainer
      title="Source"
      description="These are the sources you can select"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPage={searchedPipelinePages.length}
      displaySearchField={sources?.length !== 0 ? true : false}
      marginBottom={marginBottom}
    >
      {sources ? (
        sources.length === 0 ? (
          <SourceTablePlaceholder
            enablePlaceholderCreateButton={false}
            marginBottom={null}
          />
        ) : (
          <TableContainer
            marginBottom={null}
            tableLayout="table-auto"
            borderCollapse="border-collapse"
          >
            <TableHead
              borderColor="border-instillGrey20"
              bgColor="bg-instillGrey05"
              items={tableHeadItems}
            />
            <TableBody>
              {searchedPipelinePages[currentPage]
                ? searchedPipelinePages[currentPage].map((source) => (
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
                  ))
                : null}
            </TableBody>
          </TableContainer>
        )
      ) : (
        <TableLoadingProgress marginBottom={null} />
      )}
    </PaginationListContainer>
  );
};
