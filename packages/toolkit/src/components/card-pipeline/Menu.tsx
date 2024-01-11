import * as React from "react";
import { Button, DropdownMenu, Icons } from "@instill-ai/design-system";
import { Pipeline } from "../../lib";
import { ClonePipelineDialog, GeneralDeleteResourceDialog } from "..";

export type MenuProps = {
  pipeline: Pipeline;
  handleDeletePipeline: () => Promise<void>;
};

export const Menu = ({ pipeline, handleDeletePipeline }: MenuProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [duplicateDialogIsOpen, setDuplicateDialogIsOpen] =
    React.useState(false);

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
                setDuplicateDialogIsOpen(true);
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
      <ClonePipelineDialog
        pipeline={pipeline}
        open={duplicateDialogIsOpen}
        onOpenChange={(open) => setDuplicateDialogIsOpen(open)}
        trigger={null}
      />
      <GeneralDeleteResourceDialog
        open={deleteDialogIsOpen}
        onOpenChange={(open) => setDeleteDialogIsOpen(open)}
        resourceID={pipeline.id}
        title={`Delete ${pipeline.id}`}
        description="This action cannot be undone. This will permanently delete the pipeline."
        handleDeleteResource={async () => {
          await handleDeletePipeline();
          setDeleteDialogIsOpen(false);
        }}
        trigger={null}
      />
    </React.Fragment>
  );
};
