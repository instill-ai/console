"use client";

import * as React from "react";
import { Catalog } from "instill-sdk";

import { Button, Separator, Tag, Tooltip } from "@instill-ai/design-system";

import {
  CatalogCardMenu,
  CloneCatalogDialog,
  EditCatalogDialog,
  EditCatalogDialogData,
} from ".";
import { GeneralDeleteResourceDialog } from "../../../components";
import {
  InstillStore,
  useInstillStore,
  useListNamespaceCatalogChunks,
  useListNamespaceCatalogFiles,
  useShallow,
} from "../../../lib";
import { convertTagsToArray } from "./lib/helpers";

type CreateCatalogCardProps = {
  catalog: Catalog;
  onCardClick: () => void;
  onUpdateCatalog: (
    data: EditCatalogDialogData,
    catalogId: string,
  ) => Promise<void>;
  onCloneCatalog: (catalog: Catalog, newNamespaceId: string) => Promise<void>;
  onDeleteCatalog: (catalog: Catalog) => Promise<void>;
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
}: CreateCatalogCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const existingFiles = useListNamespaceCatalogFiles({
    namespaceId: selectedNamespace,
    catalogId: catalog.catalogId,
    accessToken: accessToken || null,
    enabled: enabledQuery && isHovered,
  });

  const chunks = useListNamespaceCatalogChunks({
    accessToken,
    namespaceId: catalog.namespaceId,
    catalogId: catalog.catalogId,
    fileUid: existingFiles.isSuccess
      ? (existingFiles.data?.[0]?.fileUid ?? null)
      : null,
    enabled: Boolean(existingFiles.data) && Boolean(accessToken) && isHovered,
    chunkUids: null,
  });

  const totalChunks = React.useMemo(() => {
    return chunks.data ? chunks.data.length : 0;
  }, [chunks.data]);

  const tooltipContent = React.useMemo(() => {
    if (!isHovered) return "";

    return `
Converting pipeline ID: ${catalog.convertingPipelines?.[0] || "N/A"}
Splitting pipeline ID: ${catalog.splittingPipelines?.[0] || "N/A"}
Embedding pipeline ID: ${catalog.embeddingPipelines?.[0] || "N/A"}
Files #: ${catalog.totalFiles || "N/A"}
Text Chunks #: ${totalChunks}
Tokens: #: ${catalog.totalTokens || "N/A"}
`.trim();
  }, [catalog, totalChunks, isHovered]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCloneDialogIsOpen(true);
  };

  const handleEditCatalogSubmit = async (data: EditCatalogDialogData) => {
    await onUpdateCatalog(data, catalog.catalogId);
    setEditDialogIsOpen(false);
  };

  const handleTagsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  return (
    <React.Fragment>
      <Tooltip.Provider>
        <Tooltip.Root disableHoverableContent={isMenuOpen}>
          <Tooltip.Trigger asChild>
            <div
              ref={cardRef}
              className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow hover:bg-semantic-bg-base-bg"
              onClick={onCardClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">{catalog.name}</div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <div className="flex-grow">
                <p className="product-body-text-3-regular line-clamp-2 break-words">
                  {catalog.description}
                </p>
              </div>
              <div className="mt-auto overflow-x-auto">
                <div className="flex gap-1 pb-2">
                  {catalog.tags ? (
                    catalog.tags.map((tag, index) => (
                      <Tag
                        key={index}
                        variant="lightNeutral"
                        className="shrink-0 !py-0.5 !px-2"
                      >
                        {tag}
                      </Tag>
                    ))
                  ) : (
                    <Button
                      variant="tertiaryGrey"
                      size="sm"
                      onClick={handleTagsClick}
                    >
                      + Tags
                    </Button>
                  )}
                </div>
              </div>
              <div
                className="flex items-end justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <CatalogCardMenu
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onClone={handleClone}
                  isOpen={isMenuOpen}
                  setIsOpen={setIsMenuOpen}
                />
              </div>
            </div>
          </Tooltip.Trigger>
          {isHovered && tooltipContent && (
            <Tooltip.Portal>
              <Tooltip.Content className="z-10 w-[300px] max-w-[300px] rounded-md bg-semantic-bg-primary p-4 shadow-lg">
                <div className="whitespace-pre-wrap text-xs break-words">
                  {tooltipContent}
                </div>
                <Tooltip.Arrow className="fill-semantic-bg-primary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
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
      <CloneCatalogDialog
        isOpen={cloneDialogIsOpen}
        onClose={() => setCloneDialogIsOpen(false)}
        onSubmit={async (clonedCatalog) => {
          await onCloneCatalog(
            {
              ...catalog,
              name: clonedCatalog.name,
              description: clonedCatalog.description ?? "",
              tags: convertTagsToArray(clonedCatalog.tags),
            },
            clonedCatalog.namespaceId,
          );
          setCloneDialogIsOpen(false);
        }}
        initialValues={{
          name: catalog.name,
          description: catalog.description,
          tags: catalog.tags ? [catalog.tags.join(", ")] : [],
          namespaceId: selectedNamespace || "",
        }}
      />
    </React.Fragment>
  );
};
