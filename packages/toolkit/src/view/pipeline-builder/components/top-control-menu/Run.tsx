import cn from "clsx";
import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { useHandleSavePipeline } from "../../lib/hooks/useHandleSavePipeline";
import { LoadingSpin } from "../../../../components";

const selector = (store: InstillStore) => ({
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  isTriggeringPipeline: store.isTriggeringPipeline,
});

export const Run = ({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) => {
  const { pipelineRecipeIsDirty, isTriggeringPipeline } = useInstillStore(
    useShallow(selector)
  );

  const handleSavePipeline = useHandleSavePipeline({ setIsSaving });

  return (
    <Button
      size="md"
      variant="tertiaryColour"
      form="start-operator-trigger-pipeline-form"
      disabled={pipelineRecipeIsDirty}
      className="!h-8 gap-x-2"
      onClick={async (e) => {
        if (pipelineRecipeIsDirty) {
          await handleSavePipeline();
          e.preventDefault();
        }
      }}
    >
      Run
      {isTriggeringPipeline ? (
        <LoadingSpin className="my-auto !text-semantic-accent-default" />
      ) : (
        <Icons.PlayCircle
          className={cn(
            "my-auto h-4 w-4",
            pipelineRecipeIsDirty
              ? "stroke-[#bfbfbf]"
              : "stroke-semantic-accent-default"
          )}
        />
      )}
    </Button>
  );
};
