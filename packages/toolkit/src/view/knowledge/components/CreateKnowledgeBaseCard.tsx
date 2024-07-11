import {
  Icons,
  Separator,
  DropdownMenu,
  Button,
  Dialog,
  Tag,
  Tooltip,
  // LinkButton,
} from "@instill-ai/design-system";
import * as React from "react";
import { useDeleteKnowledgeBase } from "../../../lib/react-query-service/knowledge/useDeleteKnowledgeBase";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import {
  formatDate,
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { EditKnowledgeDialog } from "./EditKnowledgeDialog";
import { DELETE_KNOWLEDGE_BASE_TIMEOUT } from "./undoDeleteTime";
import DeleteKnowledgeBaseNotification from "./Notifications/DeleteKnowledgeBaseNotification";

type EditKnowledgeDialogData = {
  name: string;
  description: string;
  tags?: string[];
};

type MenuProps = {
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
};

const Menu = ({ onDelete, onEdit, onDuplicate }: MenuProps) => {
  return (
    <React.Fragment>
      <div className="flex justify-center">
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
            >
              <Icons.Copy07 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={onDuplicate}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.DownloadCloud01 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
              Export
            </DropdownMenu.Item>
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
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>;
  onUpdateKnowledgeBase: (updatedKnowledgeBase: KnowledgeBase) => void;
  onCloneKnowledgeBase: (newKnowledgeBase: KnowledgeBase) => void;
};

export const CreateKnowledgeBaseCard = ({
  knowledgeBase,
  onCardClick,
  setKnowledgeBases,
  onUpdateKnowledgeBase,
  onCloneKnowledgeBase,
}: CreateKnowledgeBaseCardProps) => {
  const [isHidden, setIsHidden] = React.useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { accessToken, enabledQuery } = useInstillStore(
    useShallow((store: InstillStore) => ({
      accessToken: store.accessToken,
      enabledQuery: store.enabledQuery,
    }))
  );

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const deleteKnowledgeBase = useDeleteKnowledgeBase();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogIsOpen(false);
    setIsHidden(true);
    setShowDeleteMessage(true);
    timeoutRef.current = setTimeout(() => {
      deleteKnowledgeBaseHandler();
    }, DELETE_KNOWLEDGE_BASE_TIMEOUT);
  };

  const deleteKnowledgeBaseHandler = async () => {
    if (me.data?.id && accessToken && knowledgeBase.kbId) {
      try {
        await deleteKnowledgeBase.mutateAsync({
          ownerId: me.data.id,
          kbId: knowledgeBase.kbId,
          accessToken,
        });
        setKnowledgeBases((prevKnowledgeBases) =>
          prevKnowledgeBases.filter((kb) => kb.kbId !== knowledgeBase.kbId)
        );
      } catch (error) {
        console.error("Error deleting knowledge base:", error);
        setIsHidden(false);
      } finally {
        setShowDeleteMessage(false);
      }
    }
  };

  const tooltipContent = `
    Converting pipeline ID: AAA
    Splitting pipeline ID: BBB
    Embedding pipeline ID: DDD
    Files #: CCC
    Documents #: XXX
    Images #: YYY
    Text Chunks #: EEE
    Image Chunks #: FFF
    Downstream AI Apps: KKK

  `;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloneKnowledgeBase(knowledgeBase);
  };

  const handleEditKnowledgeSubmit = async (data: EditKnowledgeDialogData) => {
    if (!knowledgeBase.kbId) return;
    await onUpdateKnowledgeBase(data, knowledgeBase.kbId);
    setEditDialogIsOpen(false);
  };

  const undoDelete = () => {
    setShowDeleteMessage(false);
    setIsHidden(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCloseDeleteMessage = () => {
    setShowDeleteMessage(false);
    deleteKnowledgeBaseHandler();
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isHidden) {
    return showDeleteMessage ? (
      <DeleteKnowledgeBaseNotification
        knowledgeBaseName={knowledgeBase.name}
        handleCloseDeleteMessage={handleCloseDeleteMessage}
        undoDelete={undoDelete}
      />
    ) : null;
  }

  return (
    <React.Fragment>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow hover:bg-semantic-bg-base-bg"
              onClick={onCardClick}
            >
              <div className="flex items-center justify-between">
                <div className="product-headings-heading-4">{knowledgeBase.name}</div>
              </div>
              <Separator orientation="horizontal" className="my-[10px]" />
              <p className="mb-auto line-clamp-3 product-body-text-3-regular">
                {knowledgeBase.description}
              </p>
              <div className="flex items-end justify-end">
                <Menu
                  onDelete={() => { }}
                  onEdit={() => { }}
                  onDuplicate={() => { }}
                />
              </div>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="w-[360px] rounded-md bg-semantic-bg-primary p-4 shadow-lg"
              sideOffset={5}
            >
              <pre className="whitespace-pre-wrap text-xs">{tooltipContent}</pre>
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
