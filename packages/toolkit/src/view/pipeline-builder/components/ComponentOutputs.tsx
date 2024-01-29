import * as React from "react";
import { ScrollArea } from "@instill-ai/design-system";
import {
  ChooseTitleFrom,
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
  TriggerUserPipelineResponse,
  useComponentOutputFields,
  useInstillStore,
} from "../../../lib";

export const ComponentOutputs = ({
  componentID,
  outputSchema,
  nodeType,
  chooseTitleFrom,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  nodeType: "connector" | "end";
  chooseTitleFrom: ChooseTitleFrom;
}) => {
  const response = useInstillStore((store) => store.testModeTriggerResponse);

  const data = React.useMemo(() => {
    let data: Nullable<GeneralRecord> = null;

    if (nodeType === "connector") {
      if (
        !response ||
        !response.metadata.traces[componentID] ||
        !response.metadata.traces[componentID].outputs ||
        response.metadata.traces[componentID].outputs.length === 0
      ) {
        return data;
      }
      data = response.metadata.traces[componentID].outputs[0];

      return data;
    }

    if (!response || !response.outputs) {
      return data;
    }

    data = response.outputs[0];

    return data;
  }, [nodeType, componentID, response]);

  const componentOutputFields = useComponentOutputFields({
    mode: "build",
    schema: outputSchema,
    data,
    chooseTitleFrom,
  });

  return (
    <div className="flex flex-col">
      {nodeType === "connector" ? (
        <div className="mb-2 text-semantic-fg-secondary product-body-text-4-medium">
          Output
        </div>
      ) : null}
      <ScrollArea.Root
        className="nodrag nowheel h-full"
        viewPortClassName="max-h-[400px]"
      >
        <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary">
          {componentOutputFields}
        </div>
      </ScrollArea.Root>
    </div>
  );
};
