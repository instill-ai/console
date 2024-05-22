// CreateKnowledgeBaseCard.tsx
'use client';
import { Icons, Separator, Tag, DropdownMenu, Button } from "@instill-ai/design-system";
import * as React from "react"

type CreateKnowledgeBaseCardProps = {
  title: string;
  description: string;
  tags: string[];
};

type MenuProps = {
  // handleDeletePipeline: () => Promise<void>;
};


const Menu = ({ }: MenuProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="!px-2 !py-2" variant="tertiaryGrey">
              <Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="end"
            className="w-[195px]  rounded-md !px-0"
          >
            <DropdownMenu.Item
              onClick={() => {
                setCloneDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Edit03 className="h-4 w-4 mr-2 stroke-semantic-fg-secondary" />
              Edit info
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setCloneDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
            >
              <Icons.Copy07 className="h-4 w-4 mr-2 stroke-semantic-fg-secondary" />

              Duplicate
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />

            <DropdownMenu.Item
              onClick={() => {
                setDeleteDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-error-default product-body-text-4-medium"
            >
              <Icons.Trash01 className="h-4 w-4 mr-2 stroke-semantic-error-default" />

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
  return (
    <div className="flex  cursor-pointer flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-6 w-[360px]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-black">{title}</h3>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <p className="product-body-text-3-regular">{description}</p>
      <div className="flex justify-end">
        <Menu />
      </div>

      {/* Coming in V2 */}
      {/* <div className="mt-auto flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Tag key={tag}
            variant={"lightNeutral"}
          >
            {tag}
          </Tag>
        ))}
      </div> */}
    </div>
  );
};

