"use client";

import * as React from "react";
import { TriggerNamespacePipelineResponse } from "instill-sdk";

import {
  ChooseTitleFrom,
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
  chooseTitleFrom,
  response,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  nodeType: "connector" | "end";
  chooseTitleFrom: ChooseTitleFrom;
  response?: Nullable<TriggerNamespacePipelineResponse>;
}) => {
  const testModeTriggerResponse = useInstillStore(
    (store) => store.testModeTriggerResponse,
  );

  const data = React.useMemo(() => {
    let data: Nullable<GeneralRecord> = null;
    const targetResponse = response ? response : testModeTriggerResponse;

    if (nodeType === "connector") {
      if (!targetResponse) {
        return data;
      }

      const traces = targetResponse.metadata.traces;

      if (!traces || !traces[componentID]) {
        return data;
      }

      data = traces[componentID]?.outputs[0] ?? null;

      return data;
    }

    if (!targetResponse || !targetResponse.outputs) {
      return data;
    }

    data = targetResponse.outputs[0] ?? null;

    return data;
  }, [nodeType, componentID, response, testModeTriggerResponse]);

  const componentOutputFields = useComponentOutputFields({
    mode: "build",
    schema: outputSchema,
    data,
    chooseTitleFrom,
    forceFormatted: true,
  });

  return (
    <div className="flex flex-col">
      {nodeType === "connector" ? (
        <div className="mb-2 text-semantic-fg-secondary product-body-text-4-medium">
          Output
        </div>
      ) : null}
      <div className="flex max-h-[400px] w-full flex-col overflow-y-auto">
        <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary">
          {componentOutputFields}
        </div>
      </div>
    </div>
  );
};
