import { useMemo, useState } from "react";

import {
  InstanceCell,
  NameCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  TableHeadItem,
  ModelDefinitionCell,
  ModelTablePlaceholder,
  TableLoadingProgress,
} from "@/components/ui";
import { ModelWithInstance } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useResourcePages } from "@/hooks/useResourcePages";
import { PaginationListContainer } from "../PaginationListContainer";
import { useCreateUpdateDeleteResourceGuard } from "@/hooks";
import { env } from "@/utils";

export type ModelsTableProps = {
  models: Nullable<ModelWithInstance[]>;
  marginBottom: Nullable<string>;
};

export const ModelsTable = ({ models, marginBottom }: ModelsTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const modelPages = useResourcePages({
    resources: models || null,
    searchTerm,
    pageSize: env("NEXT_PUBLIC_LIST_PAGE_SIZE"),
  });

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

  return (
    <PaginationListContainer
      title="Pipeline"
      description="These are the pipelines you can select"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      totalPage={modelPages.length}
      displaySearchField={models?.length !== 0 ? true : false}
      marginBottom={marginBottom}
    >
      {models ? (
        models.length === 0 ? (
          <ModelTablePlaceholder
            enablePlaceholderCreateButton={false}
            marginBottom={null}
          />
        ) : (
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
              {modelPages[currentPage]
                ? modelPages[currentPage].map((model) => (
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
                  ))
                : null}
            </TableBody>
          </TableContainer>
        )
      ) : (
        <TableLoadingProgress marginBottom={null} />
      )}
    </PaginationListContainer>
  );
};
