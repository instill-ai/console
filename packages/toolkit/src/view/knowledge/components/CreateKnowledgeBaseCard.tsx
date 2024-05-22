// CreateKnowledgeBaseCard.tsx
'use client';

import { Icons, Separator, Tag, DropdownMenu, Button, Dialog } from "@instill-ai/design-system";
import * as React from "react";

type CreateKnowledgeBaseCardProps = {
  title: string;
  description: string;
  tags: string[];
};

type MenuProps = {
  onDelete: () => void;
};

const Menu = ({ onDelete }: MenuProps) => {
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="!px-2 !py-2" variant="tertiaryGrey">
              <Icons.DotsHorizontal className="w-4 h-4 stroke-semantic-fg-secondary" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            align="end"
            className="w-[195px] rounded-md !px-0"
          >
            <DropdownMenu.Item
              onClick={() => {
                setCloneDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Edit03 className="w-4 h-4 mr-2 stroke-semantic-fg-secondary" />
              Edit info
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setCloneDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Copy07 className="w-4 h-4 mr-2 stroke-semantic-fg-secondary" />
              Duplicate
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item
              onClick={onDelete}
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
  title,
  description,
  tags,
}: CreateKnowledgeBaseCardProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);

  const handleDelete = () => {
    // Perform the delete action here
    console.log(`Deleting knowledge base: ${title}`);
    setDeleteDialogIsOpen(false);
  };

  return (
    <React.Fragment>
      <div className="flex shadow cursor-pointer flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-6 w-[360px]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-black">{title}</h3>
        </div>
        <Separator orientation="horizontal" className="my-4" />
        <p className="product-body-text-3-regular">{description}</p>
        <div className="flex justify-end">
          <Menu onDelete={() => setDeleteDialogIsOpen(true)} />
        </div>
        {/* Coming in V2 */}
        {/* <div className="flex flex-wrap gap-1 mt-auto">
          {tags.map((tag) => (
            <Tag key={tag}
              variant={"lightNeutral"}
            >
              {tag}
            </Tag>
          ))}
        </div> */}
      </div>
      <Dialog.Root open={deleteDialogIsOpen} onOpenChange={setDeleteDialogIsOpen}>
        <Dialog.Content className="flex items-center justify-center">
          <div className="w-[350px] p-6  rounded-sm border border-b-semantic-bg-secondary flex flex-col justify-start items-center gap-6">
            <div className="flex items-center justify-center w-12 h-12 p-3 rounded-full bg-semantic-warning-bg">
              <Icons.AlertTriangle className="w-6 h-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col items-start self-stretch justify-start gap-6">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="product-headings-heading-3">Delete {title}</div>
                <div className="text-center product-body-text-2-regular">Are you sure you want to delete this knowledge base?</div>
              </div>
              <div className="flex w-full gap-2">
                <Button variant={"secondaryGrey"} onClick={() => setDeleteDialogIsOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button variant={"danger"} onClick={handleDelete}
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </React.Fragment>
  );
};