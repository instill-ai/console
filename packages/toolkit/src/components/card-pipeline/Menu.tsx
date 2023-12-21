import * as React from "react";
import { Button, DropdownMenu, Icons } from "@instill-ai/design-system";
import { Pipeline } from "../../lib";
import { GenerateDeleteResourceDialog } from "..";

export type MenuProps = {
  pipeline: Pipeline;
  handleDuplicatePipeline: () => Promise<void>;
  handleDeletePipeline: () => Promise<void>;
};

export const Menu = ({
  pipeline,
  handleDuplicatePipeline,
  handleDeletePipeline,
}: MenuProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);

  return (
    <React.Fragment>
      <div className="flex justify-center">
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
              onClick={() => {
                handleDuplicatePipeline();
              }}
              className="!px-4 !py-2.5 !product-button-button-2"
            >
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setDeleteDialogIsOpen(true);
              }}
              className="!px-4 !py-2.5 !text-semantic-error-default !product-button-button-2"
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <GenerateDeleteResourceDialog
        open={deleteDialogIsOpen}
        onOpenChange={(open) => setDeleteDialogIsOpen(open)}
        resourceID={pipeline.id}
        title={`Delete ${pipeline.id}`}
        description="This action cannot be undone. This will permanently delete the pipeline."
        handleDeleteResource={handleDeletePipeline}
        trigger={null}
      />
    </React.Fragment>
  );
};
