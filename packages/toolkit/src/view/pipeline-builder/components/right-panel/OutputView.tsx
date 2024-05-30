import { useShallow } from "zustand/react/shallow";
import { LoadingSpin } from "../../../../components";
import { InstillStore, useInstillStore } from "../../../../lib";
import { Button, Icons } from "@instill-ai/design-system";
import { ComponentOutputs } from "../ComponentOutputs";

const selector = (store: InstillStore) => ({
  isTriggeringPipeline: store.isTriggeringPipeline,
  updateDisplayResultOnRightPanel: store.updateDisplayResultOnRightPanel,
  pipelineOpenAPIOutputSchema: store.pipelineOpenAPIOutputSchema,
});

export const OutputView = () => {
  const {
    isTriggeringPipeline,
    updateDisplayResultOnRightPanel,
    pipelineOpenAPIOutputSchema,
  } = useInstillStore(useShallow(selector));

  return isTriggeringPipeline ? (
    <LoadingSpin />
  ) : (
    <div className="flex h-full w-full flex-col gap-y-6 overflow-y-auto">
      <div className="mb-6 flex w-full flex-row gap-x-1">
        <p className="flex flex-1 items-center justify-center rounded-sm bg-semantic-bg-base-bg py-2 text-semantic-fg-primary product-body-text-1-semibold">
          Result
        </p>
        <Button
          className="h-10 w-10 !px-0 !py-0"
          variant="secondaryGrey"
          size="md"
          type="button"
          onClick={() => {
            updateDisplayResultOnRightPanel(() => false);
          }}
        >
          <Icons.X className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </div>
      <ComponentOutputs
        componentID="response"
        outputSchema={pipelineOpenAPIOutputSchema}
        nodeType="response"
        chooseTitleFrom="title"
      />
    </div>
  );
};
