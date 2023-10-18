import * as React from "react";
import { OpenAPIV3 } from "openapi-types";
import {
  Nullable,
  PipelineConnectorComponent,
  PipelineTrace,
} from "../../../../lib";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../../usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import { getPropertiesFromOpenAPISchema } from "../../lib";
import { InputPropertyItem } from "./InputPropertyItem";

const selector = (store: PipelineBuilderStore) => ({
  expandAllNodes: store.expandAllNodes,
});

export const InputProperties = ({
  component,
  inputSchema,
  traces,
}: {
  component: PipelineConnectorComponent;
  inputSchema: Nullable<OpenAPIV3.SchemaObject>;
  traces: Nullable<Record<string, PipelineTrace>>;
}) => {
  const { expandAllNodes } = usePipelineBuilderStore(selector, shallow);

  const [exapndInputs, setExpandInputs] = React.useState(false);

  const inputProperties = React.useMemo(() => {
    if (!inputSchema) return [];
    return getPropertiesFromOpenAPISchema(inputSchema);
  }, [inputSchema]);

  const collapsedInputProperties = React.useMemo(() => {
    if (exapndInputs) return inputProperties;
    return inputProperties.slice(0, 3);
  }, [exapndInputs, inputProperties]);

  React.useEffect(() => {
    setExpandInputs(expandAllNodes);
  }, [expandAllNodes]);

  return inputProperties.length > 0 ? (
    <div className="mb-1 flex flex-col gap-y-1">
      {collapsedInputProperties.map((property) => {
        const path = property.path ? property.path : property.title ?? null;

        return (
          <InputPropertyItem key={path} propertyPath={path}>
            <InputPropertyItem.Value
              property={property}
              connectorConfiguration={component.configuration.input}
              traces={traces}
            />
          </InputPropertyItem>
        );
      })}
      {inputProperties.length > 3 ? (
        <div className="flex flex-row-reverse">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandInputs((prev) => !prev);
            }}
            className="text-semantic-accent-hover !underline product-body-text-4-medium"
          >
            {exapndInputs ? "Less" : "More"}
          </button>
        </div>
      ) : null}
    </div>
  ) : null;
};
