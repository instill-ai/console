import type { PipelineRelease } from "instill-sdk";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@instill-ai/design-system";

import { EmptyView, LoadingSpin } from "../../../components";
import { getHumanReadableStringFromTime } from "../../../server";
import { TABLE_PAGE_SIZE } from "./constants";

export type PipelineVersionsProps = {
  releases: PipelineRelease[];
  isReady: boolean;
};

export const PipelineVersions = ({
  releases,
  isReady,
}: PipelineVersionsProps) => {
  const columns: ColumnDef<PipelineRelease>[] = [
    {
      accessorKey: "id",
      header: () => <div className="text-left">Version</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-secondary">
            {row.getValue("id")}
          </div>
        );
      },
    },
    {
      accessorKey: "updateTime",
      header: () => <div className="text-left">Updated at</div>,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-semantic-bg-secondary-alt-primary">
            {getHumanReadableStringFromTime(
              row.getValue("updateTime"),
              Date.now(),
            )}
          </div>
        );
      },
    },
  ];

  if (!isReady) {
    return <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />;
  }

  if (isReady && releases.length === 0) {
    return (
      <EmptyView
        iconName="GitMerge"
        title="No versions deployed yet"
        description="Once you deploy a version of your pipeline, it will appear here."
        className="flex-1"
      />
    );
  }

  return (
    <div className="[&_table]:table-fixed [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(2)]:w-40">
      <DataTable
        columns={columns}
        data={releases}
        pageSize={TABLE_PAGE_SIZE}
        isLoading={!isReady}
        loadingRows={TABLE_PAGE_SIZE}
      />
    </div>
  );
};
