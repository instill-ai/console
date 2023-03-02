import { FC, useMemo } from "react";

import {
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  TableHeadItem,
  ModelDefinitionCell,
} from "@/components/ui";
import { ModelWithInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StateOverviewCounts } from "@/hooks/useStateOverviewCounts";

export type ModelsTableProps = {
  modelPages: ModelWithInstance[][];
  marginBottom: Nullable<string>;
  currentPage: number;
  stateOverviewCounts: Nullable<StateOverviewCounts>;
};

export const ModelsTable: FC<ModelsTableProps> = ({
  modelPages,
  currentPage,
  marginBottom,
  stateOverviewCounts,
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

  if (modelPages.length === 0) {
    return <></>;
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
        {modelPages[currentPage].map((model) => (
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
