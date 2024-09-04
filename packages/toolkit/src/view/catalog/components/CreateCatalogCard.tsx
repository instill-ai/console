"use client";

import * as React from "react";

import { Button, Separator, Tag, Tooltip } from "@instill-ai/design-system";

import { CatalogCardMenu, EditCatalogDialog, EditCatalogDialogData } from ".";
import { GeneralDeleteResourceDialog } from "../../../components";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import {
  useGetAllChunks,
  useListCatalogFiles,
} from "../../../lib/react-query-service/catalog";
import { Catalog } from "../../../lib/react-query-service/catalog/types";
import { MAX_VISIBLE_TAGS } from "./lib/constant";

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
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const existingFiles = useListCatalogFiles({
    namespaceId: selectedNamespace,
    catalogId: catalog.catalogId,
    accessToken: accessToken || null,
    enabled: enabledQuery && isHovered,
  });

  const chunks = useGetAllChunks({
    accessToken,
    ownerName: catalog.ownerName,
    catalogId: catalog.catalogId,
    fileUid: existingFiles.isSuccess
      ? existingFiles.data?.[0]?.fileUid
      : undefined,
    enabled: Boolean(existingFiles.data) && Boolean(accessToken) && isHovered,
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

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloneCatalog({...catalog, tags: catalog.tags || []});
  };

  const handleEditCatalogSubmit = async (data: EditCatalogDialogData) => {
    await onUpdateCatalog(data, catalog.catalogId);
    setEditDialogIsOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - 300,
      y: e.clientY - rect.top - 150,
    });
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
              onMouseMove={handleMouseMove}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">{catalog.name}</div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <p className="mb-auto line-clamp-3 product-body-text-3-regular whitespace-pre-wrap break-words">
                {catalog.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {catalog.tags && catalog.tags.length > 0 ? (
                  <>
                    {catalog.tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
                      <Tag key={index} variant="lightBlue">
                        {tag}
                      </Tag>
                    ))}
                    {catalog.tags.length > MAX_VISIBLE_TAGS && (
                      <Button
                        variant="tertiaryGrey"
                        size="sm"
                        onClick={handleTagsClick}
                      >
                        +{catalog.tags.length - MAX_VISIBLE_TAGS}
                      </Button>
                    )}
                  </>
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
            <Tooltip.Content
              className="absolute w-[300px] max-w-[300px] rounded-md bg-semantic-bg-primary p-4 shadow-lg !z-10"
              style={{
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
              }}
            >
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