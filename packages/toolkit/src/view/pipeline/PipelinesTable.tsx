import { ColumnDef } from "@tanstack/react-table";
import { Button, DataTable, useToast } from "@instill-ai/design-system";

import { isAxiosError } from "axios";
import {
  formatDate,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useUser,
  useDeleteUserPipeline,
  type Nullable,
  type Pipeline,
  type Model,
  type ConnectorResourceWithDefinition,
  type CreateUserPipelinePayload,
} from "../../lib";
import { SortIcon, TableCell, TableError } from "../../components";
import { PipelineTablePlaceholder } from "./PipelineTablePlaceholder";
import { getRawPipelineRecipeFromPipelineRecipe } from "../pipeline-builder/lib";
import { PipelineTableDropdownMenu } from "./PipelineTableMenu";

export type PipelinesTableProps = {
  pipelines: Pipeline[];
  isError: boolean;
  isLoading: boolean;
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const PipelinesTable = (props: PipelinesTableProps) => {
  const { pipelines, isError, isLoading, accessToken, enableQuery } = props;

  const { toast } = useToast();

  const user = useUser({
    accessToken,
    enabled: enableQuery,
  });

  const deletePipeline = useDeleteUserPipeline();
  function handleDeletePipeline(
    resource: Nullable<Pipeline | Model | ConnectorResourceWithDefinition>
  ): void {
    if (!resource) return;
    deletePipeline.mutate(
      {
        pipelineName: resource.name,
        accessToken: accessToken ? accessToken : null,
      },
      {
        onSuccess: () => {
          toast({
            title: "Pipeline deleted",
            variant: "alert-success",
            size: "large",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when delete the pipeline",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when delete the pipeline",
              variant: "alert-error",
              description: "Please try again later",
              size: "large",
            });
          }
        },
      }
    );
  }

  const createPipeline = useCreateUserPipeline();
  function handleDuplicatePipeline(targetPipeline: Pipeline) {
    if (!user.isSuccess) return;

    const payload: CreateUserPipelinePayload = {
      id: `copy-of-${targetPipeline.id}`,
      description: targetPipeline.description,
      recipe: getRawPipelineRecipeFromPipelineRecipe(targetPipeline.recipe),
    };

    createPipeline.mutate(
      { userName: user.data.name, payload, accessToken },
      {
        onSuccess: () => {
          toast({
            title: "Successfully saved the pipeline",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when save the pipeline",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when save the pipeline",
              variant: "alert-error",
              size: "large",
            });
          }
        },
      }
    );
  }

  const columns: ColumnDef<Pipeline>[] = [
    {
      accessorKey: "id",
      header: () => <div className="min-w-[650px] text-left">Pipelines</div>,
      cell: ({ row }) => {
        const pipelineNameFragments = row.original.name.split("/");
        const pipelineLink = `/${pipelineNameFragments[1]}/pipelines/${pipelineNameFragments[3]}`;

        return (
          <div className="text-left">
            <TableCell
              primaryLink={pipelineLink}
              primaryText={row.getValue("id")}
              secondaryLink={null}
              secondaryText={null}
              iconElement={null}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "create_time",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              className="gap-x-2 py-0"
              variant="tertiaryGrey"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="min-w-[130px]">Date added</span>
              <SortIcon type={column.getIsSorted()} />
            </Button>
          </div>
        );
      },

      cell: ({ row }) => {
        return (
          <div className="truncate text-center text-semantic-fg-secondary product-body-text-3-regular">
            {formatDate(row.getValue("create_time"))}
          </div>
        );
      },
    },
    {
      accessorKey: "uid",
      header: () => <div className="max-w-[100px] text-center"></div>,
      cell: ({ row }) => {
        return (
          <PipelineTableDropdownMenu
            pipeline={row.original}
            handleDeletePipeline={handleDeletePipeline}
            handleDuplicatePipeline={handleDuplicatePipeline}
          />
        );
      },
    },
  ];

  if (isError) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Pipelines"
        secondaryText="Check your pipelines"
      >
        <TableError marginBottom="!border-0" />
      </DataTable>
    );
  }

  if (pipelines.length === 0 && !isLoading) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSize={6}
        searchPlaceholder={null}
        searchKey={null}
        isLoading={isLoading}
        loadingRows={6}
        primaryText="Pipelines"
        secondaryText="Check your pipelines"
      >
        <PipelineTablePlaceholder
          enableCreateButton={false}
          marginBottom="!border-0"
        />
      </DataTable>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={pipelines}
      pageSize={6}
      searchPlaceholder={"Search Pipelines"}
      searchKey={"id"}
      isLoading={isLoading || !user.isSuccess}
      loadingRows={6}
      primaryText="Pipelines"
      secondaryText="Check your pipelines"
    />
  );
};
