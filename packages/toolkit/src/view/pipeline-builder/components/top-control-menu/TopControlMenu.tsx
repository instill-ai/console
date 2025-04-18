"use client";

import * as React from "react";
import cn from "clsx";
import { ReactFlowInstance } from "reactflow";

import { Button, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { useAddNodeWithDefinition } from "../../lib";
import { PublishPipelineDialog, SelectComponentDialog } from "../dialogs";
import { PipelineName } from "./PipelineName";
import { Release } from "./Release";
import { Run } from "./Run";
import { Save } from "./Save";
import { Share } from "./Share";
import { Toolkit } from "./Toolkit";

const selector = (store: InstillStore) => ({
  pipelineIsNew: store.pipelineIsNew,
  isEditingIterator: store.isEditingIterator,
});

export const TopControlMenu = ({
  reactFlowInstance,
  className,
}: {
  reactFlowInstance: Nullable<ReactFlowInstance>;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const addNode = useAddNodeWithDefinition({ reactFlowInstance });
  const { pipelineIsNew, isEditingIterator } = useInstillStore(
    useShallow(selector),
  );

  const routeInfo = useRouteInfo();
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  return (
    <React.Fragment>
      <div className={cn("flex w-full flex-row py-[5px]", className)}>
        <div className="flex flex-row items-center gap-x-4">
          <Button
            variant="tertiaryGrey"
            onClick={() => {
              if (pipelineIsNew) {
                navigate(`/${routeInfo.data.namespaceId}/pipelines`);
              } else {
                navigate(
                  `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}/playground`,
                );
              }
            }}
            className="flex cursor-pointer"
          >
            <Icons.ArrowLeft className="my-auto h-5 w-5 stroke-semantic-fg-secondary" />
          </Button>
          {isEditingIterator ? null : (
            <SelectComponentDialog
              open={open}
              onOpenChange={setOpen}
              onSelect={(definition) => {
                addNode(definition);
                setOpen(false);
              }}
            />
          )}
        </div>
        <div className="flex w-full flex-1 items-center justify-center">
          <PipelineName />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <Run setIsSaving={setIsSaving} />
          <Toolkit />
          <Save isSaving={isSaving} setIsSaving={setIsSaving} />
          <Share />
          <Release />
        </div>
      </div>
      <PublishPipelineDialog />
    </React.Fragment>
  );
};
