import {
  Icons,
  Separator,
  DropdownMenu,
  Button,
  Dialog,
  // LinkButton,
} from "@instill-ai/design-system";
import * as React from "react";
import { useUpdateKnowledgeBase } from "../../../lib/react-query-service/knowledge/useUpdateKnowledgeBase";
import { useDeleteKnowledgeBase } from "../../../lib/react-query-service/knowledge/useDeleteKnowledgeBase";
import { useCreateKnowledgeBase } from "../../../lib/react-query-service/knowledge/useCreateKnowledgeBase";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { EditKnowledgeDialog } from "./EditKnowledgeDialog";
import { DELETE_KNOWLEDGE_BASE_TIMEOUT } from "./undoDeleteTime";
import DeleteKnowledgeBaseNotification from "./Notifications/DeleteKnowledgeBaseNotification";

type CreateKnowledgeBaseCardProps = {
  knowledgeBase: KnowledgeBase;
  onCardClick: () => void;
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>;
};

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

export const CreateKnowledgeBaseCard = ({
  knowledgeBase,
  onCardClick,
  setKnowledgeBases,
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const clonedKnowledgeBase = {
      ...knowledgeBase,
      name: `${knowledgeBase.name}_Clone`,
      id: knowledgeBase.id + 1,
    };
    try {
      const newKnowledgeBase = await createKnowledgeBase.mutateAsync({
        payload: clonedKnowledgeBase,
        accessToken: accessToken,
      });
      setKnowledgeBases((prevKnowledgeBases: KnowledgeBase[]) => [
        ...prevKnowledgeBases,
        newKnowledgeBase,
      ]);
    } catch (error) {
      console.error("Error cloning knowledge base:", error);
    }
  };

  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const updateKnowledgeBase = useUpdateKnowledgeBase();
  const createKnowledgeBase = useCreateKnowledgeBase();

  const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
  });

  const { accessToken } = useInstillStore(useShallow(selector));

  const confirmDelete = () => {
    setIsDeleted(true);
    setDeleteDialogIsOpen(false);
    setShowDeleteMessage(true);
    timeoutRef.current = setTimeout(() => {
      deleteKnowledgeBaseHandler();
    }, DELETE_KNOWLEDGE_BASE_TIMEOUT);
  };

  const deleteKnowledgeBaseHandler = async () => {
    if (isDeleted) {
      await deleteKnowledgeBase.mutateAsync({
        id: knowledgeBase.id,
        accessToken: accessToken,
      });
      setKnowledgeBases((prevKnowledgeBases: KnowledgeBase[]) =>
        prevKnowledgeBases.filter((kb) => kb.id !== knowledgeBase.id)
      );
      setShowDeleteMessage(false);
      setIsDeleted(false);
    }
  };

  const handleEditKnowledgeSubmit = async (data: EditKnowledgeDialogData) => {
    try {
      const updatedKnowledgeBase = await updateKnowledgeBase.mutateAsync({
        id: knowledgeBase.id,
        payload: data,
        accessToken: accessToken,
      });

      // Update the local state immediately
      setKnowledgeBases((prevKnowledgeBases: KnowledgeBase[]) =>
        prevKnowledgeBases.map((kb) =>
          kb.id === knowledgeBase.id ? { ...kb, ...updatedKnowledgeBase } : kb
        )
      );

      setEditDialogIsOpen(false);
    } catch (error) {
      console.error("Error updating knowledge base:", error);
    }
  };

  const undoDelete = () => {
    setShowDeleteMessage(false);
    setIsDeleted(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCloseDeleteMessage = () => {
    setShowDeleteMessage(false);
    deleteKnowledgeBaseHandler();
  };

  React.useEffect(() => {
    if (showDeleteMessage) {
      timeoutRef.current = setTimeout(() => {
        setShowDeleteMessage(false);
        deleteKnowledgeBaseHandler();
      }, DELETE_KNOWLEDGE_BASE_TIMEOUT);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showDeleteMessage, deleteKnowledgeBaseHandler]);

  return (
    <React.Fragment>
      {!isDeleted ? (
        <div
          className="flex h-[175px] w-[360px] cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 shadow"
          onClick={onCardClick}
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
          <div className="flex items-end justify-end">
            <Menu
              onDelete={handleDelete}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
            />
          </div>
        </div>
      ) : null}
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
      {showDeleteMessage ? (
        <DeleteKnowledgeBaseNotification
          knowledgeBaseName={knowledgeBase.name}
          handleCloseDeleteMessage={handleCloseDeleteMessage}
          undoDelete={undoDelete}
        />
      ) : null}
      <EditKnowledgeDialog
        isOpen={editDialogIsOpen}
        onClose={() => setEditDialogIsOpen(false)}
        onSubmit={handleEditKnowledgeSubmit}
        initialValues={{
          name: knowledgeBase.name,
          description: knowledgeBase.description,
          tags: knowledgeBase.tags,
          id: knowledgeBase.id,
        }}
      />
    </React.Fragment>
  );
};
