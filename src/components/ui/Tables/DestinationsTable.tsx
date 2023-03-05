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
  DestinationTablePlaceholder,
} from "@/components/ui";
import { DestinationWithPipelines } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StateOverview } from "../StateOverview";
import { PaginationListContainer } from "../PaginationListContainer";
import { useSearchedResources , useStateOverviewCounts } from "@/hooks";
import { chunk, env } from "@/utils";

export type DestinationsTableProps = {
  destinations: Nullable<DestinationWithPipelines[]>;
  marginBottom: Nullable<string>;
};

export const DestinationsTable = ({
  destinations,
  marginBottom,
}: DestinationsTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const searchedDestinations = useSearchedResources({
    resources: destinations || null,
    searchTerm,
  });

  const searchedDestinationPages = useMemo(() => {
    return chunk(searchedDestinations, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [searchedDestinations]);

  const stateOverviewCounts = useStateOverviewCounts(searchedDestinations);

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
    <PaginationListContainer
      title="Destination"
      description="These are the destinations you can select"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPage={searchedDestinationPages.length}
      displaySearchField={destinations?.length === 0 ? false : true}
      marginBottom={marginBottom}
    >
      {destinations ? (
        destinations.length === 0 ? (
          <DestinationTablePlaceholder
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
            {searchedDestinationPages.length !== 0 ? (
              <TableBody>
                {searchedDestinationPages[currentPage].map((destination) => (
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
        )
      ) : (
        <TableLoadingProgress marginBottom={null} />
      )}
    </PaginationListContainer>
  );
};
