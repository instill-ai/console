import * as React from "react";
import cn from "clsx";
import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { LoadingSpin } from "../../../../components";
import { useHandleSavePipeline } from "../../lib/hooks/useHandleSavePipeline";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  currentVersion: store.currentVersion,
});

export const Save = ({
  isSaving,
  setIsSaving,
}: {
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
}) => {
  const { pipelineRecipeIsDirty, currentVersion } = useInstillStore(
    useShallow(selector)
  );
  const handleSavePipeline = useHandleSavePipeline({
    setIsSaving,
  });

  const canSave = React.useMemo(() => {
    if (!pipelineRecipeIsDirty) {
      return false;
    }

    if (currentVersion !== "latest") {
      return false;
    }

    return true;
  }, [currentVersion, pipelineRecipeIsDirty]);

  return (
    <Button
      size="md"
      className="flex !h-8 cursor-pointer flex-row gap-x-2"
      onClick={handleSavePipeline}
      disabled={canSave ? isSaving : true}
      variant="tertiaryColour"
    >
      Save
      {isSaving ? (
        <LoadingSpin className="!text-black" />
      ) : (
        <Icons.Save01
          className={cn(
            "h-4 w-4",
            pipelineRecipeIsDirty
              ? "stroke-semantic-fg-primary"
              : "stroke-[#bfbfbf]"
          )}
        />
      )}
    </Button>
  );
};
