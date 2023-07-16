import * as React from "react";
import {
  TableHead,
  TableHeadItem,
  PaginationListContainer,
  TableError,
  SkeletonCell,
  PaginationListContainerProps,
  PipelineTablePlaceholder,
  chunk,
  env,
  type Nullable,
} from "@instill-ai/toolkit";
import { PipelineTriggerCount } from "@/types";
import { Cell, GeneralStateCell } from "./cells";

export type PipelinesTableProps = {
  pipelineTriggerCounts: PipelineTriggerCount[];
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

export const DashboardPipelinesTable = (props: PipelinesTableProps) => {
  const { pipelineTriggerCounts, marginBottom, isError, isLoading } = props;
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState<Nullable<string>>(null);

  // We will only use searched resource when user input search term

  const pipelineTriggerPages = React.useMemo(() => {
    return chunk(pipelineTriggerCounts, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [pipelineTriggerCounts]);

  const tableHeadItems = React.useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "pipeline-mode-head",
        item: "Pipeline ID",
        width: "w-auto",
      },
      {
        key: "pipeline-state-overview-head",
        item: "Status",
        width: "w-[160px]",
      },
      {
        key: "pipeline-source-head",
        item: "Completed triggers",
        width: "w-[160px]",
      },
      {
        key: "pipeline-models-head",
        item: "Errorred triggers",
        width: "w-[160px]",
      },
    ];
  }, []);

  if (isError) {
    return (
      <PaginationListContainer
        title=""
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalPage={pipelineTriggerPages.length}
        disabledSearchField={true}
        marginBottom={marginBottom}
      >
        <TableError />
      </PaginationListContainer>
    );
  }

  if (pipelineTriggerCounts.length === 0 && !isLoading) {
    return (
      <PaginationListContainer
        title=""
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalPage={pipelineTriggerPages.length}
        disabledSearchField={true}
        marginBottom={marginBottom}
      >
        <PipelineTablePlaceholder enableCreateButton={false} />
      </PaginationListContainer>
    );
  }

  return (
    <PaginationListContainer
      title=""
      description=""
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={null}
      setSearchTerm={setSearchTerm}
      totalPage={pipelineTriggerPages.length}
      disabledSearchField={true}
      marginBottom={marginBottom}
    >
      <table className="table-auto border-collapse">
        <TableHead
          borderColor="border-instillGrey20"
          bgColor="bg-instillGrey05"
          items={tableHeadItems}
        />
        <tbody>
          {isLoading
            ? [Array(4).keys()].map((e) => (
                <tr
                  key={`pipelines-table-skeleton-${e}`}
                  className="border border-instillGrey20 bg-white"
                >
                  <SkeletonCell width={null} padding="py-2 pl-6 pr-6" />
                  <SkeletonCell width={null} padding="py-2 pr-6" />
                  <SkeletonCell width={null} padding="py-2 pr-6" />
                  <SkeletonCell width={null} padding="py-2 pr-6" />
                </tr>
              ))
            : pipelineTriggerPages[currentPage]
            ? pipelineTriggerPages[currentPage]?.map((pipelineTriggerCount) => (
                <tr
                  key={pipelineTriggerCount.pipeline_uid}
                  className="border border-instillGrey20 bg-white"
                >
                  <Cell
                    name={pipelineTriggerCount.pipeline_id}
                    width={null}
                    padding="py-2 pl-6"
                    link={`/dashboard/pipeline/${pipelineTriggerCount.pipeline_id}`}
                  />

                  <GeneralStateCell
                    width={null}
                    state={pipelineTriggerCount.watchState}
                    padding="py-2"
                  />

                  <Cell
                    name={pipelineTriggerCount.pipeline_completed}
                    width={null}
                    padding="py-2"
                  />

                  <Cell
                    name={pipelineTriggerCount.pipeline_errored}
                    width={null}
                    padding="py-2 pr-6"
                  />
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </PaginationListContainer>
  );
};
