import * as React from "react";
import { Button, DropdownMenu, Icons } from "@instill-ai/design-system";
import {
  InstillStore,
  Pipeline,
  useInstillStore,
  useShallow,
} from "./../../../lib";
import {
  ClonePipelineDialog,
  GeneralDeleteResourceDialog,
} from "./../../../components";
import { PublishPipelineDialog, SharePipelineDialog } from "../../pipeline-builder";

const selector = (store: InstillStore) => ({
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export type MenuProps = {
  pipeline: Pipeline;
  handleDeletePipeline: () => Promise<void>;
};

export const Menu = ({ pipeline, handleDeletePipeline }: MenuProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);

  const { dialogSharePipelineIsOpen, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));

  return (
    <React.Fragment>
      <div className="flex justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="!px-2 !py-2 !h-8" variant="secondaryGrey">
              <Icons.DotsVertical className="h-4 w-4 stroke-semantic-fg-primary" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="end"
            className="w-[129px] !rounded !px-0 !py-2"
          >
            <DropdownMenu.Item
              onClick={() => updateDialogSharePipelineIsOpen((prev) => !prev)}
              className="gap-x-2 !px-4 !py-2.5 !product-button-button-2"
            >
              <Icons.Share07 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
              Share
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setDeleteDialogIsOpen(true);
              }}
              className="gap-x-2 !px-4 !py-2.5 !text-semantic-error-default !product-button-button-2"
            >
              <Icons.Trash01 className="my-auto h-4 w-4 stroke-semantic-error-default" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <SharePipelineDialog />
      <PublishPipelineDialog />
      <ClonePipelineDialog
        pipeline={pipeline}
        open={cloneDialogIsOpen}
        onOpenChange={(open) => setCloneDialogIsOpen(open)}
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
