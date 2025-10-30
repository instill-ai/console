import * as React from "react";

import {
  Button,
  DropdownMenu,
  Icons,
  Separator,
} from "@instill-ai/design-system";

type KnowledgeBaseCardMenuProps = {
  onDelete: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onClone: (e: React.MouseEvent) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const KnowledgeBaseCardMenu = ({
  onDelete,
  onEdit,
  onClone,
  isOpen,
  setIsOpen,
}: KnowledgeBaseCardMenuProps) => {
  return (
    <div className="flex justify-center z-10">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <Button
            className="h-4 w-4 p-0 flex items-center justify-center !shadow-none !bg-transparent hover:!bg-semantic-bg-secondary"
            variant="tertiaryGrey"
          >
            <Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-[195px] rounded-md !p-0">
          <DropdownMenu.Item
            onClick={onEdit}
            className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
          >
            <Icons.Edit03 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
            Edit info
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={onClone}
            className="!px-4 !py-2.5 !text-semantic-fg-secondary product-body-text-4-medium"
          >
            <Icons.Copy07 className="mr-2 h-4 w-4 stroke-semantic-fg-secondary" />
            Clone
          </DropdownMenu.Item>
          {/* Coming in V2 */}
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
  );
};
