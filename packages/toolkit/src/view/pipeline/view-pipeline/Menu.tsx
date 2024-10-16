"use client";

import type { Pipeline } from "instill-sdk";
import * as React from "react";

import { Button, DropdownMenu, Icons } from "@instill-ai/design-system";

import type { InstillStore } from "./../../../lib";
import {
  PublishPipelineDialog,
  SharePipelineDialog,
} from "../../pipeline-builder";
import {
  ClonePipelineDialog,
  GeneralDeleteResourceDialog,
} from "./../../../components";
import { useInstillStore, useRouteInfo, useShallow } from "./../../../lib";

const selector = (store: InstillStore) => ({
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export type MenuProps = {
  pipeline: Pipeline;
  handleDeletePipeline: () => Promise<void>;
};

export const Menu = ({ pipeline, handleDeletePipeline }: MenuProps) => {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = React.useState(false);
  const [cloneDialogIsOpen, setCloneDialogIsOpen] = React.useState(false);

  const { updateDialogSharePipelineIsOpen } = useInstillStore(
    useShallow(selector),
  );

  const routeInfo = useRouteInfo();

  return (
    <React.Fragment>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            aria-label="More options"
            className="!p-0 h-[32px] flex items-center justify-center aspect-square"
            size="md"
            variant="secondaryGrey"
          >
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
            key="share"
          >
            <Icons.Share07 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
            Share
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              setDeleteDialogIsOpen(true);
            }}
            className="gap-x-2 !px-4 !py-2.5 !text-semantic-error-default !product-button-button-2"
            key="delete"
          >
            <Icons.Trash01 className="my-auto h-4 w-4 stroke-semantic-error-default" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {routeInfo.isSuccess ? (
        <React.Fragment>
          <SharePipelineDialog
            pipelineName={routeInfo.data.pipelineName}
            namespaceId={routeInfo.data.namespaceId}
            id={routeInfo.data.resourceId}
            ownerDisplayName={
              "user" in pipeline.owner
                ? (pipeline.owner.user.profile?.displayName ?? null)
                : (pipeline.owner.organization.profile?.displayName ?? null)
            }
          />
          <PublishPipelineDialog />
          <ClonePipelineDialog
            pipeline={pipeline}
            open={cloneDialogIsOpen}
            onOpenChange={(open) => setCloneDialogIsOpen(open)}
            trigger={null}
          />
        </React.Fragment>
      ) : null}
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
