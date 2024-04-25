"use client";

import cn from "clsx";
import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { useSavePipeline } from "../../lib";
import { LoadingSpin } from "../../../../components";
import { useRef } from "react";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  isTriggeringPipeline: store.isTriggeringPipeline,
  isEditingIterator: store.isEditingIterator,
});

export const Run = ({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) => {
  const runButtonRef = useRef<HTMLButtonElement>(null);
  const { pipelineRecipeIsDirty, isTriggeringPipeline, isEditingIterator } =
    useInstillStore(useShallow(selector));

  const savePipeline = useSavePipeline({ setIsSaving });

  return (
    <Button
      ref={runButtonRef}
      size="md"
      variant="tertiaryColour"
      form="trigger-node-trigger-pipeline-form"
      disabled={isEditingIterator}
      className="!h-8 !items-center gap-x-2"
      onClick={async (e) => {
        if (pipelineRecipeIsDirty) {
          e.preventDefault();
          await savePipeline();
          runButtonRef.current?.click();
        }
      }}
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
