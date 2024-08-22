"use client";

import * as React from "react";

import { Separator, Tooltip } from "@instill-ai/design-system";

import { CatalogCardMenu, EditCatalogDialog } from ".";
import { GeneralDeleteResourceDialog } from "../../../components";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import {
  useGetAllChunks,
  useListCatalogFiles,
} from "../../../lib/react-query-service/catalog";
import { Catalog } from "../../../lib/react-query-service/catalog/types";

type EditCatalogDialogData = {
  name: string;
  description?: string;
  tags?: string[];
};

type CreateCatalogCardProps = {
  catalog: Catalog;
  onCardClick: () => void;
  onUpdateCatalog: (
    data: EditCatalogDialogData,
    catalogId: string,
  ) => Promise<void>;
  onCloneCatalog: (catalog: Catalog) => Promise<void>;
  onDeleteCatalog: (catalog: Catalog) => Promise<void>;
  disabled?: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CreateCatalogCard = ({
  catalog,
  onCardClick,
  onUpdateCatalog,
  onCloneCatalog,
  onDeleteCatalog,
  disabled = false,
}: CreateCatalogCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const existingFiles = useListCatalogFiles({
    namespaceId: selectedNamespace,
    catalogId: catalog.catalogId,
    accessToken: accessToken || null,
    enabled: enabledQuery,
  });

  const chunks = useGetAllChunks({
    accessToken,
    ownerName: catalog.ownerName,
    catalogId: catalog.catalogId,
    fileUid: existingFiles.isSuccess
      ? existingFiles.data?.[0]?.fileUid
      : undefined,
    enabled: Boolean(existingFiles.data) && Boolean(accessToken),
  });

  const totalChunks = React.useMemo(() => {
    return chunks.data ? chunks.data.length : 0;
  }, [chunks.data]);

  const tooltipContent = React.useMemo(() => {
    return `
Converting pipeline ID: ${catalog.convertingPipelines?.[0] || "N/A"}
Splitting pipeline ID: ${catalog.splittingPipelines?.[0] || "N/A"}
Embedding pipeline ID: ${catalog.embeddingPipelines?.[0] || "N/A"}
Files #: ${catalog.totalFiles || "N/A"}
Text Chunks #: ${totalChunks}
Tokens: #: ${catalog.totalTokens || "N/A"}
`.trim();
  }, [catalog, totalChunks]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloneCatalog(catalog);
  };

  const handleEditCatalogSubmit = async (data: EditCatalogDialogData) => {
    await onUpdateCatalog(data, catalog.catalogId);
    setEditDialogIsOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              ref={cardRef}
              className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow hover:bg-semantic-bg-base-bg"
              onClick={onCardClick}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">{catalog.name}</div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <p className="mb-auto line-clamp-3 product-body-text-3-regular whitespace-pre-wrap break-words">
                {catalog.description}
              </p>
              <div
                className="flex items-end justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <CatalogCardMenu
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  disabled={disabled}
                  isOpen={isMenuOpen}
                  setIsOpen={setIsMenuOpen}
                />
              </div>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="absolute w-[300px] max-w-[300px] rounded-md bg-semantic-bg-primary p-4 shadow-lg !z-10">
              <div className="whitespace-pre-wrap text-xs break-words">
                {tooltipContent}
              </div>
              <Tooltip.Arrow className="fill-semantic-bg-primary" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <GeneralDeleteResourceDialog
        resourceID={catalog.name}
        title={`Delete ${catalog.name}`}
        description="This action cannot be undone. This will permanently delete the catalog and all its associated data."
        open={deleteDialogIsOpen}
        onOpenChange={setDeleteDialogIsOpen}
        handleDeleteResource={async () => {
          await onDeleteCatalog(catalog);
          setDeleteDialogIsOpen(false);
        }}
        trigger={null}
      />
      <EditCatalogDialog
        isOpen={editDialogIsOpen}
        onClose={() => setEditDialogIsOpen(false)}
        onSubmit={handleEditCatalogSubmit}
        initialValues={{
          name: catalog.name,
          description: catalog.description,
          tags: catalog.tags || [],
        }}
      />
    </React.Fragment>
  );
};
