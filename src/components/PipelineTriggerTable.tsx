import * as React from "react";
import {
  TableHead,
  TableHeadItem,
  PaginationListContainer,
  TableError,
  SkeletonCell,
  PipelineTablePlaceholder,
  StateOverview,
  chunk,
  env,
} from "@instill-ai/toolkit";
import { type Nullable } from "@instill-ai/toolkit";
import { PipelinesTableProps } from "@/types";
import { DeafultCell } from "./cells/DefaultCell";
import { StateCell } from "./cells/StateCell";

export const PipelineTriggerTable = (props: PipelinesTableProps) => {
  const {
    pipelines,
    marginBottom,
    isError,
    isLoading,
    statusCount,
    currentPage,
    setCurrentPage,
  } = props;

  const [searchTerm, setSearchTerm] = React.useState<Nullable<string>>(null);

  // We will only use searched resource when user input search term

  const pipelinePages = React.useMemo(() => {
    return chunk(pipelines, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [pipelines]);

  const tableHeadItems = React.useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "pipeline-state-overview-head",
        item: "Timestamp",
        width: "w-[360px]",
      },
      {
        key: "pipeline-mode-head",
        item: (
          <StateOverview
            errorCounts={statusCount[1]?.amount || 0}
            offlineCounts={0}
            onlineCounts={statusCount[0]?.amount || 0}
          />
        ),
        width: "w-[160px]",
      },
      {
        key: "pipeline-source-head",
        item: "Trigger time",
        width: "w-[160px]",
      },
      {
        key: "pipeline-models-head",
        item: "Trigger ID",
        width: "w-auto",
      },
    ];
  }, []);

  if (isError) {
    return (
      <PaginationListContainer
        title="Pipeline Trigger"
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={null}
        setSearchTerm={setSearchTerm}
        totalPage={pipelinePages.length}
        disabledSearchField={true}
        marginBottom={marginBottom}
      >
        <TableError />
      </PaginationListContainer>
    );
  }

  if (pipelines.length === 0 && !isLoading) {
    return (
      <PaginationListContainer
        title="Pipeline Triggers"
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={null}
        setSearchTerm={setSearchTerm}
        totalPage={pipelinePages.length}
        disabledSearchField={true}
        marginBottom={marginBottom}
      >
        <PipelineTablePlaceholder enableCreateButton={false} />
      </PaginationListContainer>
    );
  }

  return (
    <PaginationListContainer
      title="Pipeline Triggers"
      description=""
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={null}
      setSearchTerm={setSearchTerm}
      totalPage={pipelinePages.length}
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
            : pipelinePages[currentPage]
            ? pipelinePages[currentPage].map((pipeline) => (
                <tr
                  key={pipeline.pipeline_trigger_id}
                  className="border border-instillGrey20 bg-white"
                >
                  <DeafultCell
                    name={pipeline.trigger_time}
                    width={null}
                    padding="py-2 pl-6"
                  />

                  <StateCell
                    name={pipeline.status}
                    width={null}
                    state={pipeline.status}
                    padding="py-2 pl-6"
                  />

                  <DeafultCell
                    name={pipeline.compute_time_duration}
                    width={null}
                    padding="py-2 pl-6"
                  />

                  <DeafultCell
                    name={String(pipeline.pipeline_trigger_id)}
                    width={null}
                    padding="py-2 pl-6"
                  />
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </PaginationListContainer>
  );
};
