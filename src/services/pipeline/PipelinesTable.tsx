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
import { Pipeline } from "@/lib/instill";
import { TableLoadingPlaceholder } from "@/components/ui/TablePlaceholders";

export type PipelinesTableProps = {
  isLoadingPipeline: boolean;
  pipelines: Pipeline[];
};

const PipelinesTable: FC<PipelinesTableProps> = ({
  isLoadingPipeline,
  pipelines,
}) => {
  if (isLoadingPipeline) {
    return <TableLoadingPlaceholder />;
  }

  if (pipelines.length === 0) {
    return <PipelineTablePlaceholder />;
  }

  console.log(pipelines);

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
              state={pipeline.state}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-[15px]"
              paddingRight=""
              link={`/pipelines/${pipeline.id}`}
              lineClamp="line-clamp-2"
              displayUpdateTime={false}
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
              iconDefinition={
                pipeline.recipe.source.source_connector_definition
                  .connector_definition.icon
              }
              definitionName={
                pipeline.recipe.source.source_connector_definition
                  .connector_definition.title
              }
              connectionName={pipeline.recipe.source.id}
              cellType="shrink"
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
              lineClamp="line-clamp-2"
            />
            <InstanceCell
              type="model"
              cellType="shrink"
              width="w-[240px]"
              instances={pipeline.recipe.models.map((model) => {
                const nameList = model.name.split("/");
                const modelId = nameList[1];
                const instanceId = nameList[3];

                return {
                  name: `${modelId}/${instanceId}`,
                  state: model.state,
                };
              })}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[125px]"
              cellType="shrink"
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
              paddingRight="pr-5"
              lineClamp="line-clamp-2"
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default memo(PipelinesTable);
