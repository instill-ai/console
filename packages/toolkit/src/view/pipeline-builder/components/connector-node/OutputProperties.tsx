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
import {
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from "../../lib";

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

  const testModeOutputFields = useComponentOutputFields({
    schema: outputSchema,
    data: traces ? traces[component.id] : null,
    nodeType: "connector",
  });

  const { expandAllNodes, testModeEnabled } = useInstillStore(
    useShallow(selector)
  );

  const outputProperties = React.useMemo(() => {
    if (!outputSchema) return [];
    return getPropertiesFromOpenAPISchema(outputSchema);
  }, [outputSchema]);

  const collapsedOutputProperties = React.useMemo(() => {
    if (exapndOutputs) return outputProperties;
    return outputProperties.slice(0, 3);
  }, [outputProperties, exapndOutputs]);

  React.useEffect(() => {
    setExpandOutputs(expandAllNodes);
  }, [expandAllNodes]);

  return outputProperties.length > 0 ? (
    <div className="mb-3 flex flex-col">
      <div className="mb-1 flex flex-col gap-y-1">
        {testModeEnabled
          ? testModeOutputFields
          : collapsedOutputProperties.map((property) => {
              if (property.type === "array" && !property.instillFormat) {
                const items = property.items as InstillAIOpenAPIProperty[];

                return (
                  <div
                    key={property.title ? property.title : property.path}
                    className="w-full gap-y-1 rounded-[6px] bg-semantic-bg-primary"
                  >
                    <div className="flex flex-col gap-y-2">
                      {items.map((item) => (
                        <OutputPropertyItem
                          key={item.path ? item.path : item.title}
                          title={property.title ?? null}
                          path={property.path ?? null}
                        />
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <OutputPropertyItem
                  key={property.path ? property.path : property.title}
                  title={property.title ?? null}
                  path={property.path ?? null}
                />
              );
            })}
      </div>
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

const OutputPropertyItem = ({
  title,
  path,
}: {
  title: Nullable<string>;
  path: Nullable<string>;
}) => {
  return (
    <div
      key={title ? title : path}
      className="w-full rounded-[6px] bg-semantic-bg-primary p-2"
    >
      <div className="flex flex-row gap-x-2">
        <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
          {path}
        </p>
      </div>
    </div>
  );
};
