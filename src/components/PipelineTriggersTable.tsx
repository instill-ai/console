import * as React from "react";
import {
  TableHead,
  TableHeadItem,
  PaginationListContainer,
  TableError,
  SkeletonCell,
  PipelineTablePlaceholder,
  chunk,
  env,
  PaginationListContainerProps,
  type Nullable,
} from "@instill-ai/toolkit";
import { PipelineTriggerRecord } from "@/types";
import { Cell, GeneralStateCell } from "./cells";

export type PipelineTriggersTableProps = {
  pipelineTriggers: PipelineTriggerRecord[];
  isError: boolean;
  isLoading: boolean;
} & Pick<
  PaginationListContainerProps,
  "marginBottom" | "currentPage" | "setCurrentPage"
>;

export const PipelineTriggersTable = (props: PipelineTriggersTableProps) => {
  const {
    pipelineTriggers,
    marginBottom,
    isError,
    isLoading,
    currentPage,
    setCurrentPage,
  } = props;

  const [searchTerm, setSearchTerm] = React.useState<Nullable<string>>(null);

  // We will only use searched resource when user input search term

  const pipelineTriggerPages = React.useMemo(() => {
    return chunk(pipelineTriggers, env("NEXT_PUBLIC_LIST_PAGE_SIZE"));
  }, [pipelineTriggers]);

  const tableHeadItems = React.useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "pipeline-triggers-timestamp",
        item: "Timestamp",
        width: "w-[360px]",
      },
      {
        key: "pipeline-triggers-mode-head",
        item: "State",
        width: "w-[160px]",
      },
      {
        key: "pipeline-triggers-trigger-time-head",
        item: "Trigger time",
        width: "w-[160px]",
      },
      {
        key: "pipeline-triggers-trigger-id-head",
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
        totalPage={pipelineTriggerPages.length}
        disabledSearchField={true}
        marginBottom={marginBottom}
      >
        <TableError />
      </PaginationListContainer>
    );
  }

  if (pipelineTriggers.length === 0 && !isLoading) {
    return (
      <PaginationListContainer
        title="Pipeline Triggers"
        description=""
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        searchTerm={null}
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
      title="Pipeline Triggers"
      description=""
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={searchTerm}
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
            ? pipelineTriggerPages[currentPage].map((pipelineTrigger) => (
                <tr
                  key={pipelineTrigger.pipeline_trigger_id}
                  className="border border-instillGrey20 bg-white"
                >
                  <Cell
                    name={pipelineTrigger.trigger_time}
                    width={null}
                    padding="py-2 pl-6"
                  />

                  <GeneralStateCell
                    width={null}
                    state={pipelineTrigger.status}
                    padding="py-2"
                  />

                  <Cell
                    name={pipelineTrigger.compute_time_duration}
                    width={null}
                    padding="py-2"
                  />

                  <Cell
                    name={String(pipelineTrigger.pipeline_trigger_id)}
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
