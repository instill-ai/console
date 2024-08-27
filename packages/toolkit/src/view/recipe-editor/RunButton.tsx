"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../lib";

const selector = (store: InstillStore) => ({
  isTriggeringPipeline: store.isTriggeringPipeline,
});

export const RunButton = () => {
  const { isTriggeringPipeline } = useInstillStore(useShallow(selector));

  return (
    <div className="flex flex-row gap-x-1 items-center">
      <Button
        size="md"
        variant="primary"
        form="variable-node-trigger-pipeline-form"
        className="!h-8 !w-[77px] !items-center gap-x-2"
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
