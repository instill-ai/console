import {
  ConnectionTypeCell,
  PipelineOverviewTableHead,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";
import ModelsCell from "@/components/ui/TableCells/ModelsCell";
import { FC } from "react";
import { Pipeline } from "./PipelineServices";

export type PipelineOverViewTableProps = {
  pipeline: Pipeline;
  isLoading: boolean;
};

const PipelineOverViewTable: FC<PipelineOverViewTableProps> = ({
  pipeline,
  isLoading,
}) => {
  if (isLoading) {
    return <div>isLoading</div>;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <PipelineOverviewTableHead
        sourceStatus="active"
        modelStatus="active"
        destinationStatus="disconnected"
      />
      <TableBody>
        <TableRow borderColor="border-instillGrey20" bgColor="bg-white">
          <ConnectionTypeCell
            cellType="expand"
            width="w-[269px]"
            type={pipeline.recipe.source.type}
            name={pipeline.recipe.source.name}
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
            type={pipeline.recipe.destination.type}
            name={pipeline.recipe.destination.name}
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
