import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Button, DataTable } from "@instill-ai/design-system";

import { Pipeline, PipelineRelease, useRouteInfo } from "../../../lib";
import { getHumanReadableStringFromTime } from "../../../server";
import { TABLE_PAGE_SIZE } from "./constants";

export type PipelineVersionsProps = {
  pipeline?: Pipeline;
  releases: PipelineRelease[];
  isReady: boolean;
};

export const PipelineVersions = ({
  pipeline,
  releases,
  isReady,
}: PipelineVersionsProps) => {
  const router = useRouter();
  const routeInfo = useRouteInfo();
  const searchParams = useSearchParams();
  const currentVersion = searchParams.get("version");
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
    {
      accessorKey: "createdTime",
      header: () => null,
      cell: ({ row }) => {
        const version = row.getValue("id") as string;
        const isActive = version === currentVersion;

        return !isActive ? (
          <div className="flex flex-row justify-end">
            <Button
              variant="secondaryGrey"
              disabled={isActive}
              onClick={() => onTestVersion(version)}
              className="-my-2"
            >
              Test
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  const onTestVersion = (version: string) => {
    if (!pipeline) {
      return;
    }

    const newSearchParams = new URLSearchParams();
    newSearchParams.set("version", version);

    const combinedSearchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(newSearchParams),
    });

    router.replace(
      `/${routeInfo.data.namespaceId}/pipelines/${pipeline?.id}/playground?${combinedSearchParams.toString()}`,
    );
  };

  return (
    <div className="[&_table]:table-fixed [&_table_th:nth-child(1)]:w-auto [&_table_th:nth-child(2)]:w-40 [&_table_th:nth-child(3)]:w-28">
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
