import {
  InstanceCell,
  ModelTableHead,
  ModelTablePlaceholder,
  NameCell,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
} from "@/components/ui";
import type { ModelTablePlaceholderProps } from "@/components/ui";
import ModelDefinitionCell from "@/components/ui/TableCells/ModelDefinitionCell";
import { ModelWithInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { FC } from "react";

export type ModelTableProps = {
  models: ModelWithInstance[];
  isLoading: boolean;
  marginBottom: Nullable<string>;
  enablePlaceholderCreateButton: ModelTablePlaceholderProps["enablePlaceholderCreateButton"];
};

const ModelTable: FC<ModelTableProps> = ({
  models,
  isLoading,
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  if (isLoading) {
    return <TableLoadingProgress marginBottom={marginBottom} />;
  }

  if (models.length === 0) {
    return (
      <ModelTablePlaceholder
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
      <ModelTableHead offlineCounts={0} onlineCounts={0} errorCounts={0} />
      <TableBody>
        {models.map((model) => (
          <TableRow
            bgColor="bg-white"
            borderColor="border-instillGrey20"
            key={model.id}
          >
            <NameCell
              name={model.id}
              width="w-[269px]"
              state="STATE_ONLINE"
              updatedAt={model.update_time}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft="pl-5"
              paddingRight=""
              link={`/models/${model.id}`}
              lineClamp="line-clamp-1"
              displayUpdateTime={false}
            />
            <ModelDefinitionCell
              width="w-[269px]"
              modelDefinition={model.model_definition}
              paddingBottom="pb-5"
              paddingTop="pt-5"
              paddingLeft=""
              paddingRight=""
            />
            <InstanceCell
              type="model"
              cellType="expand"
              width="w-[269px]"
              instances={model.instances.map((instance) => {
                return {
                  name: instance.id,
                  state: instance.state,
                };
              })}
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

export default ModelTable;
