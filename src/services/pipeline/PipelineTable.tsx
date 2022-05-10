import {
  ConnectionTypeCell,
  InstanceCell,
  ModeCell,
  NameCell,
  PipelineTableHead,
  PipelineTablePlaceholder,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";
import { FC, memo } from "react";
import { transformModelStateToStatus } from "../model/ModelServices";
import {
  Pipeline,
  transformMode,
  transformPipelineStateToStatus,
} from "./PipelineServices";

export type PipelineTableProps = {
  isLoadingPipeline: boolean;
  pipelines: Pipeline[];
};

const PipelineTable: FC<PipelineTableProps> = ({
  isLoadingPipeline,
  pipelines,
}) => {
  if (isLoadingPipeline) {
    return <div>isLoading</div>;
  }

  if (pipelines.length === 0) {
    return <PipelineTablePlaceholder />;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <PipelineTableHead offlineCounts={1} onlineCounts={1} errorCounts={1} />
      <TableBody>
        {pipelines.map((pipeline) => (
          <TableRow key={pipeline.id}>
            <NameCell
              name={pipeline.name}
              width="w-[191px]"
              updatedAt={pipeline.update_time}
              status={transformPipelineStateToStatus(pipeline.state)}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-[15px]"
              paddingRight=""
            />
            <ModeCell
              width="w-[100px]"
              mode={transformMode(pipeline.mode)}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[125px]"
              type={pipeline.recipe.source.name}
              name={pipeline.recipe.source.type}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <InstanceCell
              type="model"
              width="w-[190px]"
              instances={pipeline.recipe.models.map((model) => {
                return {
                  name: `${model.name}/${model.instance_name}`,
                  status: transformModelStateToStatus(model.state),
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[160px]"
              type={pipeline.recipe.destination.name}
              name={pipeline.recipe.destination.type}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight="pr-5"
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default memo(PipelineTable);
