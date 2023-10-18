import type { Meta } from "@storybook/react";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PipelineState } from "../../types/general";
import { Tag } from "../Tag";
import { Checkbox } from "../Checkbox";
import { Icons } from "../Icons";
import { Button } from "../Button";
import * as React from "react";

const meta: Meta<typeof DataTable> = {
  title: "Components/NewUi/DataTable",
};

export default meta;

type Sort = "asc" | "desc" | false;
const getIcon = (type: Sort) => {
  if (type === "asc") {
    return <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  if (type === "desc") {
    return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  return (
    <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />
  );
};

// Fetch data from your API here.
const data: PipelineTriggerCount[] = [
  {
    pipeline_id: "Pipeline-name-1",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 0,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "outrageous-indigo-ladybug",
    watchState: "STATE_ERROR",
    pipeline_completed: 1320,
    pipeline_errored: 132,
  },
  {
    pipeline_id: "calm-coral-sloth",
    watchState: "STATE_ERROR",
    pipeline_completed: 923,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "certain-aqua-flamingo",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 200,
    pipeline_errored: 132,
  },
  {
    pipeline_id: "marked-aqua-amphibian",
    watchState: "STATE_ERROR",
    pipeline_completed: 220,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "potential-rose-heron",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 230,
    pipeline_errored: 112,
  },
  {
    pipeline_id: "calm-azure-goose",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 320,
    pipeline_errored: 142,
  },
  {
    pipeline_id: "fluttering-red-booby",
    watchState: "STATE_ERROR",
    pipeline_completed: 720,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "efficient-apricot-ptarmigan",
    watchState: "STATE_UNSPECIFIED",
    pipeline_completed: 520,
    pipeline_errored: 612,
  },
  {
    pipeline_id: "resonant-rose-booby",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 20,
    pipeline_errored: 82,
  },
  {
    pipeline_id: "competent-fuchsia-turkey",
    watchState: "STATE_ERROR",
    pipeline_completed: 270,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "robust-brown-ape",
    watchState: "STATE_UNSPECIFIED",
    pipeline_completed: 1120,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "resonant-rose-booby",
    watchState: "STATE_ACTIVE",
    pipeline_completed: 210,
    pipeline_errored: 312,
  },
  {
    pipeline_id: "Pipeline-name-14",
    watchState: "STATE_ERROR",
    pipeline_completed: 20,
    pipeline_errored: 12,
  },
  {
    pipeline_id: "competent-fuchsia-turkey",
    watchState: "STATE_ERROR",
    pipeline_completed: 260,
    pipeline_errored: 32,
  },
];

export type PipelineTriggerCount = {
  pipeline_id: string;
  pipeline_completed: number;
  pipeline_errored: number;
  watchState: PipelineState;
};

export const Default = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const columns: ColumnDef<PipelineTriggerCount>[] = [
    {
      accessorKey: "pipeline_id",
      header: () => <div className="min-w-[600px] text-left">Pipeline Id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex min-w-[600px] flex-row gap-x-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="h-5 w-5"
            />
            <div className="w-auto">{row.getValue("pipeline_id")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "watchState",
      accessorFn: (row) => row.watchState,
      header: () => <div className="max-w-[80px] text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <Tag
              variant={
                row.getValue("watchState") === "STATE_ACTIVE"
                  ? "lightGreen"
                  : "lightRed"
              }
              className="border-0"
              size={"sm"}
            >
              Active
            </Tag>
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_completed",
      header: ({ column }) => {
        return (
          <div className="min-w-[130px] text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px]">Completed Triggers</span>
              {getIcon(column.getIsSorted())}
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_completed")}
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_errored",
      header: ({ column }) => (
        <div className="min-w-[110px] text-center">
          <Button
            className="gap-x-2 py-0"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="min-w-[110px]">Errored Triggers</span>
            {getIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_errored")}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={6}
      searchPlaceholder="Search Pipeline"
      searchKey="pipeline_id"
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Primary Text"
      secondaryText="Secondary Text"
    />
  );
};

export const NoDataFound = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const columns: ColumnDef<PipelineTriggerCount>[] = [
    {
      accessorKey: "pipeline_id",
      header: () => <div className="min-w-[600px] text-left">Pipeline Id</div>,
      cell: ({ row }) => {
        return (
          <div className="flex min-w-[600px] flex-row gap-x-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="h-5 w-5"
            />
            <div className="w-auto">{row.getValue("pipeline_id")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "watchState",
      accessorFn: (row) => row.watchState,
      header: () => <div className="max-w-[80px] text-center">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <Tag
              variant={
                row.getValue("watchState") === "STATE_ACTIVE"
                  ? "lightGreen"
                  : "lightRed"
              }
              className="border-0"
              size={"sm"}
            >
              Active
            </Tag>
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_completed",
      header: ({ column }) => {
        return (
          <div className="min-w-[130px] text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px]">Completed Triggers</span>
              {getIcon(column.getIsSorted())}
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_completed")}
          </div>
        );
      },
    },
    {
      accessorKey: "pipeline_errored",
      header: ({ column }) => (
        <div className="min-w-[110px] text-center">
          <Button
            className="gap-x-2 py-0"
            variant="tertiaryGrey"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="min-w-[110px]">Errored Triggers</span>
            {getIcon(column.getIsSorted())}
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center text-semantic-fg-secondary">
            {row.getValue("pipeline_errored")}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={[]}
      pageSize={6}
      searchPlaceholder="Search Pipeline"
      searchKey="pipeline_id"
      isLoading={isLoading}
      loadingRows={6}
      primaryText="Primary Text"
      secondaryText="Secondary Text"
    >
      <div>No Pipeline Found</div>
    </DataTable>
  );
};
