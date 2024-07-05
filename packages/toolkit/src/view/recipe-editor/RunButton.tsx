"use client";

import { Button, Icons } from "@instill-ai/design-system";

import { LoadingSpin } from "../../components";
import { InstillStore, useInstillStore, useShallow } from "../../lib";

const selector = (store: InstillStore) => ({
  isTriggeringPipeline: store.isTriggeringPipeline,
});

export const RunButton = () => {
  const { isTriggeringPipeline } = useInstillStore(useShallow(selector));

  return (
    <Button
      size="md"
      variant="tertiaryColour"
      form="variable-node-trigger-pipeline-form"
      className="!h-8 !items-center gap-x-2"
    >
      Run
      {isTriggeringPipeline ? (
        <LoadingSpin className="!h-4 !w-4 !text-semantic-accent-default" />
      ) : (
        <Icons.PlayCircle className="h-4 w-4 stroke-semantic-accent-default" />
      )}
    </Button>
  );
};
