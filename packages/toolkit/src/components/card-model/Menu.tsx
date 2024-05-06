"use client";

import * as React from "react";
import { Button, DropdownMenu, Icons } from "@instill-ai/design-system";
import { GeneralDeleteResourceDialog } from "../GeneralDeleteResourceDialog";
import { Model } from "../../lib";

export type MenuProps = {
  model: Model,
  handleDeleteModel: () => Promise<void>;
};

export const Menu = (props: MenuProps) => {
  const { handleDeleteModel, model } = props;
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex justify-center ml-auto shrink-0">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="!px-2 !py-2" variant="tertiaryGrey">
              <Icons.DotsVertical className="h-4 w-4 stroke-semantic-fg-primary" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="end"
            className="w-[129px] !rounded !px-0 !py-2"
          >
            <DropdownMenu.Item
              onClick={() => setDeleteDialogIsOpen(true)}
              className="!px-4 !py-2.5 !text-semantic-error-default !product-button-button-2 gap-x-2"
            >
              <Icons.Trash01 className="h-4 w-4 stroke-semantic-error-default" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <GeneralDeleteResourceDialog
        open={deleteDialogIsOpen}
        onOpenChange={(open) => setDeleteDialogIsOpen(open)}
        resourceID={model.id}
        title={`Delete ${model.id}`}
        description="This action cannot be undone. This will permanently delete the model."
        handleDeleteResource={async () => {
          await handleDeleteModel();
          setDeleteDialogIsOpen(false);
        }}
        trigger={null}
      />
    </React.Fragment>
  );
};
