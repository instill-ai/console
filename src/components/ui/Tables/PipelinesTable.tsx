import { useMemo, useState } from "react";

import {
  ConnectionTypeCell,
  InstanceCell,
  ModeCell,
  NameCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  TableHeadItem,
  StateOverview,
  PipelineTablePlaceholder,
  TableLoadingProgress,
} from "@/components/ui";
import { Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useSearchedResources } from "@/hooks/useSearchedResources";
import { PaginationListContainer } from "../PaginationListContainer";
import { useStateOverviewCounts } from "@/hooks";
import { chunk, env } from "@/utils";

export type PipelinesTableProps = {
  pipelines: Nullable<Pipeline[]>;
  marginBottom: Nullable<string>;
};

export const PipelinesTable = ({
  pipelines,
  marginBottom,
}: PipelinesTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const searchedPipelines = useSearchedResources({
    resources: pipelines || null,
    searchTerm,
  });

  const searchedPipelinePages = useMemo(() => {
    return chunk(searchedPipelines, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [searchedPipelines]);

  const stateOverviewCounts = useStateOverviewCounts(searchedPipelines);

  const tableHeadItems = useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "pipeline-state-overview-head",
        item: (
          <StateOverview
            errorCounts={stateOverviewCounts?.error || 0}
            offlineCounts={stateOverviewCounts?.offline || 0}
            onlineCounts={stateOverviewCounts?.online || 0}
          />
        ),
      },
      {
        key: "pipeline-mode-head",
        item: "Mode",
      },
      {
        key: "pipeline-source-head",
        item: "Source",
      },
      {
        key: "pipeline-models-head",
        item: "Model instances",
      },
      {
        key: "pipeline-destination-head",
        item: "Destination",
      },
    ];
  }, [stateOverviewCounts]);

  return (
    <PaginationListContainer
      title="Pipeline"
      description="These are the pipelines you can select"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPage={searchedPipelinePages.length}
      displaySearchField={pipelines?.length !== 0 ? true : false}
      marginBottom={marginBottom}
    >
      {pipelines ? (
        pipelines.length === 0 ? (
          <PipelineTablePlaceholder
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
                ? searchedPipelinePages[currentPage].map((pipeline) => (
                    <TableRow
                      borderColor="border-instillGrey20"
                      bgColor="bg-white"
                      key={pipeline.id}
                    >
                      <NameCell
                        name={pipeline.id}
                        width="w-[191px]"
                        updatedAt={pipeline.update_time}
                        state={pipeline.state}
                        padding="py-5 pl-[15px]"
                        link={`/pipelines/${pipeline.id}`}
                        lineClamp="line-clamp-2"
                        displayUpdateTime={true}
                        displayStateIndicator={true}
                      />
                      <ModeCell
                        width="w-[100px]"
                        mode={pipeline.mode}
                        padding="py-5"
                      />
                      <ConnectionTypeCell
                        width="w-[125px]"
                        connectorDefinition={
                          pipeline.recipe.source.source_connector_definition
                        }
                        connectorName={pipeline.recipe.source.id}
                        cellType="shrink"
                        padding="py-5"
                        lineClamp="line-clamp-2"
                      />
                      <InstanceCell
                        type="model"
                        cellType="shrink"
                        width="w-[240px]"
                        instances={pipeline.recipe.models.map((model) => {
                          const nameList = model.name.split("/");
                          const modelId = nameList[1];
                          const instanceId = nameList[3];

                          return {
                            name: `${modelId}/${instanceId}`,
                            state: model.state,
                          };
                        })}
                        padding="py-5"
                      />
                      <ConnectionTypeCell
                        width="w-[125px]"
                        cellType="shrink"
                        connectorDefinition={
                          pipeline.recipe.destination
                            .destination_connector_definition
                        }
                        connectorName={pipeline.recipe.destination.id}
                        padding="py-5 pr-5"
                        lineClamp="line-clamp-2"
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
