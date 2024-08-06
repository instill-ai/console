import * as React from "react";

import {
  Button,
  Dialog,
  Icons,
  Separator,
  Tooltip,
} from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useQueries,
  useShallow,
} from "../../../lib";
import {
  getAllChunks,
  useListKnowledgeBaseFiles,
} from "../../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../lib/react-query-service/knowledge/types";
import { EditKnowledgeDialog, CatalogCardMenu } from "./";
import { truncateName } from "./lib/functions";

type EditKnowledgeDialogData = {
  name: string;
  description?: string;
  tags?: string[];
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
  disabled = false,
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector),
  );

  const { data: filesData } = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace || null,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken: accessToken || null,
    enabled: enabledQuery && isHovered,
  });

  const chunkQueries = useQueries({
    queries: (filesData?.files || []).map((file) => ({
      queryKey: ["chunks", knowledgeBase.catalogId, file.fileUid],
      queryFn: () =>
        getAllChunks(
          accessToken || "",
          knowledgeBase.ownerName,
          knowledgeBase.catalogId,
          file.fileUid,
        ),
      enabled: enabledQuery && isHovered && !!filesData && !!accessToken,
    })),
  });

  const totalChunks = React.useMemo(() => {
    return chunkQueries.reduce((total, query) => {
      if (query.data) {
        return total + query.data.length;
      }
      return total;
    }, 0);
  }, [chunkQueries]);

  const tooltipContent = React.useMemo(() => {
    if (!isHovered) return "";

    return `
Converting pipeline ID: ${knowledgeBase.convertingPipelines?.[0] || "N/A"}
Splitting pipeline ID: ${knowledgeBase.splittingPipelines?.[0] || "N/A"}
Embedding pipeline ID: ${knowledgeBase.embeddingPipelines?.[0] || "N/A"}
Files #: ${knowledgeBase.totalFiles || "N/A"}
Text Chunks #: ${totalChunks}
Tokens: #: ${knowledgeBase.totalTokens || "N/A"}
`.trim();
  }, [isHovered, knowledgeBase, totalChunks]);

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
    await onUpdateKnowledgeBase(data, knowledgeBase.catalogId);
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
        <Tooltip.Root disableHoverableContent={isMenuOpen}>
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
                  Delete {truncateName(knowledgeBase.name)}
                </div>
                <div className="text-center product-body-text-2-regular">
                  Are you sure you want to delete this catalog?
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
