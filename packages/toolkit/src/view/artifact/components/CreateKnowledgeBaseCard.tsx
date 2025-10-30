"use client";

import * as React from "react";
import { KnowledgeBase } from "instill-sdk";

import { Button, Separator, Tag, Tooltip } from "@instill-ai/design-system";

import {
  CloneKnowledgeBaseDialog,
  EditKnowledgeBaseDialog,
  EditKnowledgeBaseDialogData,
  KnowledgeBaseCardMenu,
} from ".";
import { GeneralDeleteResourceDialog } from "../../../components";
import {
  InstillStore,
  useInstillStore,
  useListNamespaceChunks,
  useListNamespaceFiles,
  useShallow,
} from "../../../lib";
import { convertTagsToArray } from "./lib/helpers";

type CreateKnowledgeBaseCardProps = {
  knowledgeBase: KnowledgeBase;
  onCardClick: () => void;
  onUpdateKnowledgeBase: (
    data: EditKnowledgeBaseDialogData,
    knowledgeBaseId: string,
  ) => Promise<void>;
  onCloneKnowledgeBase: (
    knowledgeBase: KnowledgeBase,
    newNamespaceId: string,
  ) => Promise<void>;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => Promise<void>;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const CreateKnowledgeBaseCard = ({
  knowledgeBase,
  onCardClick,
  onUpdateKnowledgeBase,
  onCloneKnowledgeBase,
  onDeleteKnowledgeBase,
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const existingFiles = useListNamespaceFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.id,
    accessToken: accessToken || null,
    enabled: enabledQuery && isHovered,
  });

  const chunks = useListNamespaceChunks({
    accessToken,
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.id,
    fileUid: existingFiles.isSuccess
      ? (existingFiles.data?.[0]?.uid ?? null)
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
Files #: ${knowledgeBase.totalFiles || "N/A"}
Text Chunks #: ${totalChunks}
Tokens: #: ${knowledgeBase.totalTokens || "N/A"}
`.trim();
  }, [knowledgeBase, totalChunks, isHovered]);

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

  const handleEditKnowledgeBaseSubmit = async (
    data: EditKnowledgeBaseDialogData,
  ) => {
    await onUpdateKnowledgeBase(data, knowledgeBase.id);
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
                <div className="product-headings-heading-4">
                  {knowledgeBase.id}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <div className="flex-grow">
                <p className="product-body-text-3-regular line-clamp-2 break-words">
                  {knowledgeBase.description}
                </p>
              </div>
              <div className="mt-auto overflow-x-auto">
                <div className="flex gap-1 pb-2">
                  {knowledgeBase.tags ? (
                    knowledgeBase.tags.map((tag: string, index: number) => (
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
                <KnowledgeBaseCardMenu
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
              <Tooltip.Content className="z-10 w-auto max-w-[220px] rounded-md bg-semantic-bg-primary p-4 shadow-lg">
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
        resourceID={knowledgeBase.id}
        title={`Delete ${knowledgeBase.id}`}
        description="This action cannot be undone. This will permanently delete the knowledge base and all its associated data."
        open={deleteDialogIsOpen}
        onOpenChange={setDeleteDialogIsOpen}
        handleDeleteResource={async () => {
          await onDeleteKnowledgeBase(knowledgeBase);
          setDeleteDialogIsOpen(false);
        }}
        trigger={null}
      />
      <EditKnowledgeBaseDialog
        isOpen={editDialogIsOpen}
        onClose={() => setEditDialogIsOpen(false)}
        onSubmit={handleEditKnowledgeBaseSubmit}
        initialValues={{
          name: knowledgeBase.id,
          description: knowledgeBase.description,
          tags: knowledgeBase.tags || [],
        }}
      />
      <CloneKnowledgeBaseDialog
        isOpen={cloneDialogIsOpen}
        onClose={() => setCloneDialogIsOpen(false)}
        onSubmit={async (clonedKnowledgeBase) => {
          await onCloneKnowledgeBase(
            {
              ...knowledgeBase,
              id: clonedKnowledgeBase.name,
              description: clonedKnowledgeBase.description ?? "",
              tags: convertTagsToArray(clonedKnowledgeBase.tags),
            },
            clonedKnowledgeBase.namespaceId,
          );
          setCloneDialogIsOpen(false);
        }}
        initialValues={{
          name: knowledgeBase.id,
          description: knowledgeBase.description,
          tags: knowledgeBase.tags ? [knowledgeBase.tags.join(", ")] : [],
          namespaceId: selectedNamespace || "",
        }}
      />
    </React.Fragment>
  );
};
