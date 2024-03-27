"use client";

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
  response,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  nodeType: "connector" | "end";
  chooseTitleFrom: ChooseTitleFrom;
  response?: Nullable<TriggerUserPipelineResponse>;
}) => {
  const testModeTriggerResponse = useInstillStore(
    (store) => store.testModeTriggerResponse
  );

  const data = React.useMemo(() => {
    let data: Nullable<GeneralRecord> = null;
    const targetResponse = response ? response : testModeTriggerResponse;

    if (nodeType === "connector") {
      if (
        !targetResponse ||
        !targetResponse.metadata.traces[componentID] ||
        !targetResponse.metadata.traces[componentID].outputs ||
        targetResponse.metadata.traces[componentID].outputs.length === 0
      ) {
        return data;
      }
      data = targetResponse.metadata.traces[componentID].outputs[0];

      return data;
    }

    if (!targetResponse || !targetResponse.outputs) {
      return data;
    }

    data = targetResponse.outputs[0];

    return data;
  }, [nodeType, componentID, response, testModeTriggerResponse]);

  const componentOutputFields = useComponentOutputFields({
    mode: "build",
    schema: outputSchema,
    data,
    chooseTitleFrom,
  });

  return (
    <div className="flex flex-col ml-3">
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
