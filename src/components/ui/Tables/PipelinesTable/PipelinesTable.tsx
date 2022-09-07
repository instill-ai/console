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
  TableLoadingProgress,
} from "@/components/ui";

import type { PipelineTablePlaceholderProps } from "@/components/ui";
import { Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useStateOverviewCounts } from "@/hooks/useStateOverviewCounts";

export type PipelinesTableProps = {
  isLoadingPipeline: boolean;
  pipelines: Pipeline[];
  marginBottom: Nullable<string>;
  enablePlaceholderCreateButton: PipelineTablePlaceholderProps["enablePlaceholderCreateButton"];
};

const PipelinesTable: FC<PipelinesTableProps> = ({
  isLoadingPipeline,
  pipelines,
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const stateOverviewCounts = useStateOverviewCounts(
    isLoadingPipeline ? null : pipelines
  );

  if (isLoadingPipeline) {
    return <TableLoadingProgress marginBottom={marginBottom} />;
  }

  if (pipelines.length === 0) {
    return (
      <PipelineTablePlaceholder
        marginBottom={marginBottom}
        enablePlaceholderCreateButton={enablePlaceholderCreateButton}
      />
    );
  }

  return (
    <TableContainer
      marginBottom={marginBottom}
      tableLayout="table-auto"
      borderCollapse="border-collapse"
    >
      <PipelinesTableHead
        onlineCounts={stateOverviewCounts?.online || 0}
        offlineCounts={stateOverviewCounts?.offline || 0}
        errorCounts={stateOverviewCounts?.error || 0}
      />
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
              padding="py-5 pl-[15px]"
              link={`/pipelines/${pipeline.id}`}
              lineClamp="line-clamp-2"
              displayUpdateTime={true}
              displayStateIndicator={true}
            />
            <ModeCell width="w-[100px]" mode={pipeline.mode} padding="py-5" />
            <ConnectionTypeCell
              width="w-[125px]"
              connectorDefinition={
                pipeline.recipe.source.source_connector_definition
              }
              connectorName={pipeline.recipe.source.id}
              cellType="shrink"
              padding="py-5"
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
              padding="py-5"
            />
            <ConnectionTypeCell
              width="w-[125px]"
              cellType="shrink"
              connectorDefinition={
                pipeline.recipe.destination.destination_connector_definition
              }
              connectorName={pipeline.recipe.destination.id}
              padding="py-5 pr-5"
              lineClamp="line-clamp-2"
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default memo(PipelinesTable);
