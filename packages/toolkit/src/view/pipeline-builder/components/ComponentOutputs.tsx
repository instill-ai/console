import * as React from "react";
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
  const res = useInstillStore((store) => store.testModeTriggerResponse);

  const data = React.useMemo(() => {
    let data: Nullable<GeneralRecord> = null;

    if (nodeType === "connector") {
      if (
        !res ||
        !res.metadata.traces[componentID] ||
        !res.metadata.traces[componentID].outputs ||
        res.metadata.traces[componentID].outputs.length === 0
      ) {
        return data;
      }
      data = res.metadata.traces[componentID].outputs[0];

      return data;
    }

    if (!res || !res.outputs) {
      return data;
    }

    data = res.outputs[0];

    return data;
  }, [nodeType, componentID, res]);

  const componentOutputFields = useComponentOutputFields({
    schema: outputSchema,
    data,
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
