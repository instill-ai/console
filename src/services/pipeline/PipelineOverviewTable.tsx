import {
  ConnectionTypeCell,
  PipelineOverviewTableHead,
  TableBody,
  TableContainer,
  TableLoadingPlaceholder,
  TableRow,
} from "@/components/ui";
import ModelsCell from "@/components/ui/TableCells/ModelsCell";
import { Pipeline } from "@/lib/instill";
import { FC } from "react";

export type PipelineOverViewTableProps = {
  pipeline: Pipeline;
  isLoading: boolean;
};

const PipelineOverViewTable: FC<PipelineOverViewTableProps> = ({
  pipeline,
  isLoading,
}) => {
  if (isLoading) {
    return <TableLoadingPlaceholder />;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <PipelineOverviewTableHead
        sourceState="STATE_CONNECTED"
        modelState="STATE_ONLINE"
        destinationState="STATE_CONNECTED"
      />
      <TableBody>
        <TableRow borderColor="border-instillGrey20" bgColor="bg-white">
          <ConnectionTypeCell
            cellType="expand"
            width="w-[269px]"
            definitionName={
              pipeline.recipe.source.source_connector_definition
                .connector_definition.title
            }
            connectionName={pipeline.recipe.source.id}
            iconDefinition={
              pipeline.recipe.source.source_connector_definition
                .connector_definition.icon
            }
            paddingBottom="pb-5"
            paddingTop="pt-5"
            paddingLeft=""
            paddingRight="pl-[15px]"
          />
          <ModelsCell
            models={pipeline.recipe.models}
            width="w-[269px]"
            paddingBottom="pb-5"
            paddingTop="pt-5"
            paddingLeft=""
            paddingRight=""
          />
          <ConnectionTypeCell
            cellType="expand"
            width="w-[269px]"
            definitionName={
              pipeline.recipe.destination.destination_connector_definition
                .connector_definition.title
            }
            connectionName={pipeline.recipe.destination.id}
            iconDefinition={
              pipeline.recipe.destination.destination_connector_definition
                .connector_definition.icon
            }
            paddingBottom="pb-5"
            paddingTop="pt-5"
            paddingLeft=""
            paddingRight="pr-[15px]"
          />
        </TableRow>
      </TableBody>
    </TableContainer>
  );
};

export default PipelineOverViewTable;
