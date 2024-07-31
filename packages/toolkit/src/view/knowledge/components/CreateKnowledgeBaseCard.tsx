import * as React from "react";

import {
  Button,
  Dialog,
  DropdownMenu,
  Icons,
  Separator,
  Tooltip,
} from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { useListChunks } from "../../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../lib/react-query-service/knowledge/types";
import { EditKnowledgeDialog } from "./EditKnowledgeDialog";

type EditKnowledgeDialogData = {
  name: string;
  description?: string;
  tags?: string[];
};

type MenuProps = {
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  disabled: boolean;
};

const Menu = ({ onDelete, onEdit, onDuplicate, disabled }: MenuProps) => {
  return (
    <React.Fragment>
      <div className="flex justify-center z-10">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="" variant="tertiaryGrey">
              <Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            align="end"
            className="w-[195px] rounded-md !p-0"
          >
            <DropdownMenu.Item
              onClick={onEdit}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Edit03 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              Edit info
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={onDuplicate}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
              disabled={disabled}
            >
              <Icons.Copy07 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              Duplicate
            </DropdownMenu.Item>
            {/* <DropdownMenu.Item
              onClick={onDuplicate}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.DownloadCloud01 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              Export
            </DropdownMenu.Item> */}
            <Separator orientation="horizontal" />
            <DropdownMenu.Item
              onClick={onDelete}
              className="!px-4 !py-2.5 !text-semantic-error-default product-body-text-4-medium"
            >
              <Icons.Trash01 className="mr-2 h-4 w-4 stroke-semantic-error-default" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </React.Fragment>
  );
};
type CreateKnowledgeBaseCardProps = {
  knowledgeBase: KnowledgeBase;
  onCardClick: () => void;
  onUpdateKnowledgeBase: (
    data: EditKnowledgeDialogData,
    kbId: string,
  ) => Promise<void>;
  onCloneKnowledgeBase: (knowledgeBase: KnowledgeBase) => Promise<void>;
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  disabled?: boolean;
};

export const CreateKnowledgeBaseCard = ({
  knowledgeBase,
  onCardClick,
  onUpdateKnowledgeBase,
  onCloneKnowledgeBase,
  onDeleteKnowledgeBase,
  disabled = false,
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const { accessToken, enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
    })),
  );

  const { data: chunks, isLoading: isLoadingChunks } = useListChunks({
    kbId: knowledgeBase.kbId,
    accessToken: accessToken || null,
    enabled: enabledQuery && isHovered,
    ownerId: knowledgeBase.ownerName,
    fileUid: "",
  });

  const tooltipContent = React.useMemo(() => {
    if (!isHovered) return "";

    if (isLoadingChunks) return "Loading...";

    const textChunks = chunks
      ? chunks.filter((chunk: { type: string }) => chunk.type === "TEXT")
      : [];

    return `
Converting pipeline ID: ${knowledgeBase.convertingPipelines?.[0] || "N/A"}
Splitting pipeline ID: ${knowledgeBase.splittingPipelines?.[0] || "N/A"}
Embedding pipeline ID: ${knowledgeBase.embeddingPipelines?.[0] || "N/A"}
Files #: ${knowledgeBase.totalFiles || "N/A"}
Text Chunks #: ${textChunks.length}
    `.trim();
  }, [isHovered, isLoadingChunks, chunks, knowledgeBase]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogIsOpen(false);
    onDeleteKnowledgeBase(knowledgeBase);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloneKnowledgeBase(knowledgeBase);
  };

  const handleEditKnowledgeSubmit = async (data: EditKnowledgeDialogData) => {
    await onUpdateKnowledgeBase(data, knowledgeBase.kbId);
    setEditDialogIsOpen(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - 300,
      y: e.clientY - rect.top - 150,
    });
  };

  return (
    <React.Fragment>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow hover:bg-semantic-bg-base-bg"
              onClick={onCardClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">
                  {knowledgeBase.name}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <p className="mb-auto line-clamp-3 product-body-text-3-regular">
                {knowledgeBase.description}
              </p>
              <div
                className="flex items-end justify-end"
                onClick={(e) => e.stopPropagation()}
              >
                <Menu
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  disabled={disabled}
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
      <Dialog.Root
        open={deleteDialogIsOpen}
        onOpenChange={setDeleteDialogIsOpen}
      >
        <Dialog.Content className="!w-[350px] rounded-sm !p-0">
          <div className="flex flex-col items-center justify-start gap-6 rounded-sm border border-b-semantic-bg-secondary p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg p-3">
              <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col items-start justify-start gap-6 self-stretch">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="product-headings-heading-3">
                  Delete {knowledgeBase.name}
                </div>
                <div className="text-center product-body-text-2-regular">
                  Are you sure you want to delete this knowledge base?
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Button
                  variant="secondaryGrey"
                  onClick={() => setDeleteDialogIsOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <EditKnowledgeDialog
        isOpen={editDialogIsOpen}
        onClose={() => setEditDialogIsOpen(false)}
        onSubmit={handleEditKnowledgeSubmit}
        initialValues={{
          name: knowledgeBase.name,
          description: knowledgeBase.description,
          tags: knowledgeBase.tags || [],
        }}
      />
    </React.Fragment>
  );
};
