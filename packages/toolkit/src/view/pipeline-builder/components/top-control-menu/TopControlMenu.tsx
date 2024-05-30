"use client";

import * as React from "react";
import cn from "clsx";
import { Run } from "./Run";
import { Toolkit } from "./Toolkit";
import { Save } from "./Save";
import { Share } from "./Share";
import { Release } from "./Release";
import { PublishPipelineDialog } from "../dialogs";
import {
  InstillStore,
  Nullable,
  useRouteInfo,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { Button, Icons } from "@instill-ai/design-system";
import { PipelineName } from "./PipelineName";
import { Validate } from "./Validate";

const selector = (store: InstillStore) => ({
  pipelineIsNew: store.pipelineIsNew,
  isEditingIterator: store.isEditingIterator,
});

export const TopControlMenu = () => {
  const [isSaving, setIsSaving] = React.useState(false);
  const { pipelineIsNew } = useInstillStore(useShallow(selector));

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
                  `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}`,
                );
              }
            }}
            className="flex cursor-pointer"
          >
            <Icons.ArrowLeft className="my-auto h-5 w-5 stroke-semantic-fg-secondary" />
          </Button>
        </div>
        <div className="flex w-full flex-1 items-center justify-center">
          <PipelineName />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <Run setIsSaving={setIsSaving} />
          <Validate />
          <Toolkit />
          <Save isSaving={isSaving} setIsSaving={setIsSaving} />
          <Share />
          <Release />
        </div>
      </div>
      <PublishPipelineDialog
        pipelineName={routeInfo.data.pipelineName}
        entity={routeInfo.data.namespaceId}
        id={routeInfo.data.resourceId}
      />
    </React.Fragment>
  );
};
