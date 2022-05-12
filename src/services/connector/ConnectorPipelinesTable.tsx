import {
  ConnectionTypeCell,
  InstanceCell,
  NameCell,
  SourcePipelinesTableHead,
  TableBody,
  TableContainer,
  TableRow,
} from "@/components/ui";
import { FC, memo } from "react";
import { Pipeline } from "../pipeline/PipelineServices";

export type ConnectorPipelinesTableProps = {
  pipelines: Pipeline[];
  isLoading: boolean;
};

const ConnectorPipelinesTable: FC<ConnectorPipelinesTableProps> = ({
  pipelines,
  isLoading,
}) => {
  if (isLoading) {
    return <div>isLoading</div>;
  }

  return (
    <TableContainer tableLayout="table-auto" borderCollapse="border-collapse">
      <SourcePipelinesTableHead
        offlineCounts={1}
        onlineCounts={1}
        errorCounts={1}
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
              status={pipeline.status}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-[15px]"
              paddingRight=""
            />
            <ConnectionTypeCell
              width="w-[125px]"
              type={pipeline.recipe.source.type}
              name={pipeline.recipe.source.name}
              cellType="shrink"
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
              cellType="shrink"
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

export default memo(ConnectorPipelinesTable);
