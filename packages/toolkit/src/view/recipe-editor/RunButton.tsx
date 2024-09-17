"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../lib";
import { EditorButtonTooltipWrapper } from "./EditorButtonTooltipWrapper";
import { useIsMac } from "./lib";

const selector = (store: InstillStore) => ({
  isTriggeringPipeline: store.isTriggeringPipeline,
  runButtonRef: store.runButtonRef,
});

export const RunButton = () => {
  const isMac = useIsMac();
  const { isTriggeringPipeline, runButtonRef } = useInstillStore(
    useShallow(selector),
  );

  return (
    <div className="flex flex-row gap-x-1 items-center">
      <EditorButtonTooltipWrapper
        tooltipContent={isMac ? "CMD Enter" : "CTRL Enter"}
      >
        <Button
          size="md"
          variant="primary"
          form="variable-node-trigger-pipeline-form"
          className="!h-8 !w-[77px] !items-center gap-x-2"
          ref={runButtonRef}
        >
          {isTriggeringPipeline ? (
            <React.Fragment>
              Stop
              <Icons.Stop className="h-4 w-4 fill-semantic-bg-primary stroke-semantic-bg-primary" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              Run
              <Icons.Play className="h-4 w-4 fill-semantic-bg-primary !stroke-semantic-bg-primary" />
            </React.Fragment>
          )}
        </Button>
      </EditorButtonTooltipWrapper>

      {isTriggeringPipeline ? (
        <p className="text-semantic-fg-primary product-body-text-4-italic">
          Running
        </p>
      ) : (
        <p className="w-[44px]"></p>
      )}
    </div>
  );
};
