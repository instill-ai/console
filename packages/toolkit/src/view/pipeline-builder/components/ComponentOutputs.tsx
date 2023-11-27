import { ScrollArea } from "@instill-ai/design-system";
import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
  useComponentOutputFields,
  useInstillStore,
} from "../../../lib";

export const ComponentOutputs = ({
  componentID,
  outputSchema,
  nodeType,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  nodeType: "connector" | "end";
}) => {
  const triggerResponse = useInstillStore(
    (store) => store.testModeTriggerResponse
  );

  let data: Nullable<GeneralRecord> = null;

  if (nodeType === "connector") {
    data = triggerResponse
      ? triggerResponse.metadata.traces[componentID].outputs[0]
      : null;
  } else {
    data = triggerResponse ? triggerResponse.outputs : null;
  }

  const componentOutputFields = useComponentOutputFields({
    schema: outputSchema,
    data,
    nodeType,
  });

  return (
    <div className="flex flex-col">
      {nodeType === "connector" ? (
        <div className="mb-2 product-body-text-4-medium">output</div>
      ) : null}
      <ScrollArea.Root
        className="nodrag nowheel h-full"
        viewPortClassName="max-h-[400px]"
      >
        <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary py-2">
          {componentOutputFields}
        </div>
      </ScrollArea.Root>
    </div>
  );
};
