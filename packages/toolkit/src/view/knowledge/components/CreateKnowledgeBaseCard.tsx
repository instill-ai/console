import * as React from "react";
import {
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
import { GeneralDeleteResourceDialog } from "../../../components/GeneralDeleteResourceDialog";

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
  onDeleteKnowledgeBase: (knowledgeBase: KnowledgeBase) => Promise<void>;
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
  const cardRef = React.useRef<HTMLDivElement>(null);

  const { accessToken, enabledQuery, selectedNamespace } = useInstillStore(
    useShallow(selector)
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
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <React.Fragment>
      <Tooltip.Provider>
        <Tooltip.Root open={isHovered && !isMenuOpen}>
          <Tooltip.Trigger asChild>
            <div
              ref={cardRef}
              className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow hover:bg-semantic-bg-base-bg"
              onClick={onCardClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">
                  {knowledgeBase.name}
                </div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <p className="mb-auto line-clamp-3 product-body-text-3-regular whitespace-pre-wrap break-words">
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
                left: `${mousePosition.x - 150}px`,
                top: `${mousePosition.y - 70 }px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
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
        resourceID={knowledgeBase.name}
        title={`Delete ${knowledgeBase.name}`}
        description="This action cannot be undone. This will permanently delete the catalog and all its associated data."
        open={deleteDialogIsOpen}
        onOpenChange={setDeleteDialogIsOpen}
        handleDeleteResource={async () => {
          await onDeleteKnowledgeBase(knowledgeBase);
          setDeleteDialogIsOpen(false);
        }}
        trigger={null}
      />
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