import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import {
  InstillJSONSchema,
  InstillStore,
  Nullable,
  PipelineConnectorComponent,
  PipelineTrace,
  useComponentOutputFields,
  useInstillStore,
} from "../../../../lib";
import { getPropertiesFromOpenAPISchema } from "../../lib";

const selector = (store: InstillStore) => ({
  expandAllNodes: store.expandAllNodes,
  testModeEnabled: store.testModeEnabled,
});

export const OutputProperties = ({
  component,
  outputSchema,
  traces,
}: {
  component: PipelineConnectorComponent;
  outputSchema: Nullable<InstillJSONSchema>;
  traces: Nullable<Record<string, PipelineTrace>>;
}) => {
  const [exapndOutputs, setExpandOutputs] = React.useState(false);

  const { expandAllNodes, testModeEnabled } = useInstillStore(
    useShallow(selector)
  );

  const componentOutputFields = useComponentOutputFields({
    schema: outputSchema,
    data: traces ? traces[component.id].outputs[0] : null,
    nodeType: "connector",
    hideField: testModeEnabled ? false : true,
  });

  const outputProperties = React.useMemo(() => {
    if (!outputSchema) return [];
    return getPropertiesFromOpenAPISchema(outputSchema);
  }, [outputSchema]);

  React.useEffect(() => {
    setExpandOutputs(expandAllNodes);
  }, [expandAllNodes]);

  return outputProperties.length > 0 ? (
    <div className="mb-3 flex flex-col">
      <div className="mb-1 flex flex-col gap-y-1">{componentOutputFields}</div>
      {outputProperties.length > 3 ? (
        <div className="flex flex-row-reverse">
          <button
            onClick={() => setExpandOutputs((prev) => !prev)}
            className="text-semantic-accent-hover !underline product-body-text-4-medium"
          >
            {exapndOutputs ? "Less" : "More"}
          </button>
        </div>
      ) : null}
    </div>
  ) : null;
};
