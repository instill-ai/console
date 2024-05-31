import { Icons, Separator, DropdownMenu, Button, Dialog, LinkButton } from "@instill-ai/design-system";
import * as React from "react";
import { CreateKnowledgeDialog } from "./CreateKnowledgeDialog";
import { useUpdateKnowledgeBase } from "../../../lib/react-query-service/knowledge/useUpdateKnowledgeBase";
import { useCreateKnowledgeBase } from "../../../lib/react-query-service/knowledge/useCreateKnowledgeBase";
import { useDeleteKnowledgeBase } from "../../../lib/react-query-service/knowledge/useDeleteKnowledgeBase";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";

type CreateKnowledgeBaseCardProps = {
  knowledgeBase: KnowledgeBase;
  onCardClick: () => void;
};

type MenuProps = {
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
};

const Menu = ({ onDelete, onEdit }: MenuProps) => {
  return (
    <React.Fragment>
      <div className="flex justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="" variant="tertiaryGrey">
              <Icons.DotsHorizontal className="w-4 h-4 stroke-semantic-fg-secondary" />
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
              <Icons.Edit03 className="w-4 h-4 mr-2 stroke-semantic-fg-secondary" />
              Edit info
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={(e) => { e.stopPropagation(); }}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Copy07 className="w-4 h-4 mr-2 stroke-semantic-fg-secondary" />
              Duplicate
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item
              onClick={(e) => { e.stopPropagation(); onDelete(e); }}
              className="!px-4 !py-2.5 !text-semantic-error-default product-body-text-4-medium"
            >
              <Icons.Trash01 className="w-4 h-4 mr-2 stroke-semantic-error-default" />
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
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = React.useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDialogIsOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogIsOpen(true);
  };

  const deleteKnowledgeBase = useDeleteKnowledgeBase();
  const updateKnowledgeBase = useUpdateKnowledgeBase();

  const confirmDelete = async () => {
    // await deleteKnowledgeBase.mutateAsync({
    //   id: knowledgeBase.id,
    //   accessToken: null,
    // });
    setDeleteDialogIsOpen(false);
    setShowDeleteMessage(true);
    setTimeout(() => setShowDeleteMessage(false), 5000);
  };

  const handleCreateKnowledgeSubmit = async (data: any) => {
    await updateKnowledgeBase.mutateAsync({
      id: knowledgeBase.id,
      payload: data,
      accessToken: null,
    });
    setEditDialogIsOpen(false);
  };

  return (
    <React.Fragment>
      {showDeleteMessage && (
        <div className="fixed bottom-4 right-4 w-[400px] h-[136px] p-4 bg-semantic-bg-primary rounded-lg shadow border border-slate-200  justify-start items-start gap-4 flex mr-4">
          <Icons.AlertTriangle className="w-6 h-6 stroke-semantic-warning-on-bg" />
          <div className="grow shrink basis-0 h-[104px] flex-col justify-start items-start gap-4">
            <div className="self-stretch flex-col justify-start items-start gap-1 flex">
              <div className="self-stretch product-body-text-2-semibold">This Knowledge base has been deleted</div>
              <div className="self-stretch product-body-text-2-regular">If this was a mistake, click "Undo Action" to reapply your changes.</div>
            </div>
            <LinkButton
              className=""
              variant="secondary"
              size="md"
              onClick={() => setShowDeleteMessage(false)}
            >
              Undo Action
            </LinkButton>
          </div>
        </div>
      )}
      <div className="flex shadow cursor-pointer flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-5 w-[360px] h-[175px]" onClick={onCardClick}>
        <div className="flex items-center justify-between">
          <div className="product-headings-heading-4">{knowledgeBase.name}</div>
        </div>
        <Separator orientation="horizontal" className="my-[10px]" />
        <p className="product-body-text-3-regular line-clamp-3 mb-auto">{knowledgeBase.description}</p>
        <div className="flex justify-end items-end">
          <Menu onDelete={handleDelete} onEdit={handleEdit} />
        </div>
      </div>
      <Dialog.Root open={deleteDialogIsOpen} onOpenChange={setDeleteDialogIsOpen}>
        <Dialog.Content className="!w-[350px] rounded-sm !p-0">
          <div className="rounded-sm border border-b-semantic-bg-secondary flex flex-col justify-start items-center gap-6 p-6">
            <div className="flex items-center justify-center w-12 h-12 p-3 rounded-full bg-semantic-warning-bg">
              <Icons.AlertTriangle className="w-6 h-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col items-start self-stretch justify-start gap-6">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="product-headings-heading-3">Delete {knowledgeBase.name}</div>
                <div className="text-center product-body-text-2-regular">Are you sure you want to delete this knowledge base?</div>
              </div>
              <div className="flex w-full gap-2">
                <Button variant={"secondaryGrey"} onClick={() => setDeleteDialogIsOpen(false)} className="w-full">
                  Cancel
                </Button>
                <Button variant={"danger"} onClick={confirmDelete} className="w-full">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <CreateKnowledgeDialog
        isOpen={editDialogIsOpen}
        onClose={() => setEditDialogIsOpen(false)}
        onSubmit={handleCreateKnowledgeSubmit}
        title="Edit knowledge base"
      />
    </React.Fragment>
  );
};
