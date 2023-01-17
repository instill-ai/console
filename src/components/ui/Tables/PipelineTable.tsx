import { useMemo } from "react";
import {
  ConnectionTypeCell,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
  TableHeadItem,
  TableHead,
  ModelsCell,
} from "@/components/ui";
import { Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type PipelineTableProps = {
  pipeline: Nullable<Pipeline>;
  isLoading: boolean;
  marginBottom: Nullable<string>;
};

export const PipelineTable = ({
  pipeline,
  isLoading,
  marginBottom,
}: PipelineTableProps) => {
  const tableHeadItems = useMemo<TableHeadItem[]>(() => {
    const getHeadItem = (name: string) => {
      return (
        <div className="flex flex-row gap-x-[15px]">
          <div className="my-auto text-instillGrey90 text-instill-body">
            {name}
          </div>
        </div>
      );
    };

    return [
      {
        key: "pipeline-source",
        item: getHeadItem("Source"),
      },
      {
        key: "pipeline-models",
        item: getHeadItem("Model instances"),
      },
      {
        key: "pipeline-destination",
        item: getHeadItem("Destination"),
      },
    ];
  }, []);

  if (isLoading) {
    return <TableLoadingProgress marginBottom={null} />;
  }

  if (!pipeline) {
    return null;
  }

  return (
    <TableContainer
      marginBottom={marginBottom}
      tableLayout="table-auto"
      borderCollapse="border-collapse"
    >
      <TableHead
        bgColor="bg-instillGrey05"
        borderColor="border-instillGrey20"
        items={tableHeadItems}
      />
      <TableBody>
        <TableRow borderColor="border-instillGrey20" bgColor="bg-white">
          <ConnectionTypeCell
            cellType="expand"
            width="w-[269px]"
            padding="py-5 pl-[15px]"
            connectorDefinition={
              pipeline.recipe.source.source_connector_definition
            }
            connectorName={pipeline.recipe.source.id}
          />
          <ModelsCell
            modelInstances={pipeline.recipe.models}
            width="w-[269px]"
            padding="py-5"
          />
          <ConnectionTypeCell
            cellType="expand"
            width="w-[269px]"
            padding="py-5 pr-[15px]"
            connectorDefinition={
              pipeline.recipe.destination.destination_connector_definition
            }
            connectorName={pipeline.recipe.destination.id}
          />
        </TableRow>
      </TableBody>
    </TableContainer>
  );
};
