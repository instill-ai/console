import { FC, memo } from "react";

import {
  ConnectionTypeCell,
  InstanceCell,
  ModeCell,
  NameCell,
  PipelinesTableHead,
  PipelineTablePlaceholder,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";
import { Pipeline } from "./PipelineServices";

export type PipelinesTableProps = {
  isLoadingPipeline: boolean;
  pipelines: Pipeline[];
};

const PipelinesTable: FC<PipelinesTableProps> = ({
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
      <PipelinesTableHead offlineCounts={1} onlineCounts={1} errorCounts={1} />
      <TableBody>
        {pipelines.map((pipeline) => (
          <TableRow
            borderColor="border-instillGrey20"
            bgColor="bg-white"
            key={pipeline.id}
          >
            <NameCell
              name={pipeline.id}
              width="w-[191px]"
              updatedAt={pipeline.update_time}
              status={pipeline.status}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-[15px]"
              paddingRight=""
            />
            <ModeCell
              width="w-[100px]"
              mode={pipeline.mode}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[125px]"
              type={pipeline.recipe.source.type}
              name={pipeline.recipe.source.name}
              cellType="expand"
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
                  name: `${model.id}/${model.instance}`,
                  status: model.status,
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[160px]"
              cellType="expand"
              type={pipeline.recipe.destination.type}
              name={pipeline.recipe.destination.name}
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

export default memo(PipelinesTable);
