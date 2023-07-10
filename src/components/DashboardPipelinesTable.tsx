import * as React from "react";
import {
  NameCell,
  TableHead,
  TableHeadItem,
  PaginationListContainer,
  TableError,
  SkeletonCell,
  PaginationListContainerProps,
  ResourceState,
  PipelineTablePlaceholder,
  chunk,
  env,
} from "@instill-ai/toolkit";
import { type Nullable } from "@instill-ai/toolkit";
import { DeafultCell } from "./cells/DefaultCell";
import { PipelineTriggerCount } from "@/types";
import { StateCell } from "./cells/StateCell";

export type PipelinesTableProps = {
  pipelines: PipelineTriggerCount[];
  isError: boolean;
  isLoading: boolean;
} & Pick<PaginationListContainerProps, "marginBottom">;

const getStatus = (status: string): ResourceState => {
  if (status === "completed") {
    return "STATE_ACTIVE";
  }
  if (status === "error") {
    return "STATE_ERROR";
  }
  return "STATE_UNSPECIFIED";
};

export const DashboardPipelinesTable = (props: PipelinesTableProps) => {
  const { pipelines, marginBottom, isError, isLoading } = props;
  const [currentPage, setCurrentPage] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState<Nullable<string>>(null);

  // We will only use searched resource when user input search term

  const pipelinePages = React.useMemo(() => {
    return chunk(pipelines, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [pipelines]);

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
        width: "w-[280px]",
      },
      {
        key: "pipeline-source-head",
        item: "Completed triggers",
        width: "w-[180px]",
      },
      {
        key: "pipeline-models-head",
        item: "Errorred triggers",
        width: "w-[180px]",
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
        title=""
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
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
      title=""
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
            ? pipelinePages[currentPage]?.map((pipeline) => (
                <tr
                  key={pipeline.pipeline_uid}
                  className="border border-instillGrey20 bg-white"
                >
                  <DeafultCell
                    name={pipeline.pipeline_id}
                    width={null}
                    padding="py-2 pl-6"
                    link={`/dashboard/pipeline/${pipeline.pipeline_id}`}
                  />

                  <StateCell
                    name={
                      pipeline.status ? pipeline.status : "STATE_UNSPECIFIED"
                    }
                    width={null}
                    state={
                      pipeline.status ? pipeline.status : "STATE_UNSPECIFIED"
                    }
                    padding="py-2 pl-6"
                  />

                  <StateCell
                    name={pipeline.pipeline_completed}
                    width={null}
                    state={getStatus("completed")}
                    padding="py-2 pl-6"
                  />

                  <StateCell
                    name={pipeline.pipeline_error}
                    width={null}
                    state={getStatus("error")}
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
