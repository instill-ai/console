import * as React from "react";
import { Button, Dialog, DropdownMenu, Icons } from "@instill-ai/design-system";
import {
  ConnectorResourceWithDefinition,
  Model,
  Nullable,
  Pipeline,
} from "../../lib";
import { GeneralDeleteResourceModal } from "../../components";

export const PipelineTableDropdownMenu = ({
  pipeline,
  handleDuplicatePipeline,
  handleDeletePipeline,
}: {
  pipeline: Pipeline;
  handleDuplicatePipeline: (pipeline: Pipeline) => void;
  handleDeletePipeline: (
    resource: Nullable<Pipeline | ConnectorResourceWithDefinition | Model>
  ) => void;
}) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);

  return (
    <>
      <div className="flex justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="!px-2 !py-2" variant="tertiaryGrey">
              <Icons.DotsVertical className="w-4 h-4 stroke-semantic-fg-primary" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-[129px] !rounded !py-2 !px-0">
            <DropdownMenu.Item
              onClick={() => {
                handleDuplicatePipeline(pipeline);
              }}
              className="!product-button-button-2 !px-4 !py-2.5"
            >
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setDeleteDialogIsOpen(true);
              }}
              className="!product-button-button-2 !px-4 !py-2.5 !text-semantic-error-default"
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <Dialog.Root
        open={deleteDialogIsOpen}
        onOpenChange={(open) => setDeleteDialogIsOpen(open)}
      >
        <Dialog.Content className="!w-[512px]">
          <GeneralDeleteResourceModal
            resource={pipeline}
            handleDeleteResource={handleDeletePipeline}
          />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
