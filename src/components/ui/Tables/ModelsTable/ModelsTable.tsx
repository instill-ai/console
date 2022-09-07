import { FC, useMemo } from "react";

import {
  InstanceCell,
  ModelTableHead,
  ModelTablePlaceholder,
  NameCell,
  TableBody,
  TableContainer,
  TableLoadingProgress,
  TableRow,
  TableHead,
  TableHeadItem,
} from "@/components/ui";
import type { ModelTablePlaceholderProps } from "@/components/ui";
import ModelDefinitionCell from "@/components/ui/TableCells/ModelDefinitionCell";
import { ModelWithInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";

export type ModelsTableProps = {
  models: ModelWithInstance[];
  isLoading: boolean;
  marginBottom: Nullable<string>;
  enablePlaceholderCreateButton: ModelTablePlaceholderProps["enablePlaceholderCreateButton"];
};

const ModelsTable: FC<ModelsTableProps> = ({
  models,
  isLoading,
  marginBottom,
  enablePlaceholderCreateButton,
}) => {
  const tableHeadItems = useMemo<TableHeadItem[]>(() => {
    return [
      {
        key: "model-name",
        item: <></>,
      },
      {
        key: "model-source-head",
        item: "Model source",
      },
      {
        key: "model-instances-head",
        item: "Instances",
      },
    ];
  }, []);

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
      <TableHead
        borderColor="border-instillGrey20"
        bgColor="bg-instillGrey05"
        items={tableHeadItems}
      />
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
              padding="py-5 pl-5"
              updatedAt={model.update_time}
              link={`/models/${model.id}`}
              lineClamp="line-clamp-1"
              displayUpdateTime={true}
              displayStateIndicator={false}
            />
            <ModelDefinitionCell
              width="w-[269px]"
              modelDefinition={model.model_definition}
              padding="py-5"
            />
            <InstanceCell
              type="model"
              cellType="expand"
              width="w-[269px]"
              padding="py-5 pr-5"
              instances={model.instances.map((instance) => ({
                name: instance.id,
                state: instance.state,
              }))}
            />
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};

export default ModelsTable;
