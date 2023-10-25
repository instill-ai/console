import * as React from "react";
import { Tag } from "@instill-ai/design-system";

import {
  GeneralRecord,
  Nullable,
  TriggerUserPipelineResponse,
  dot,
} from "../../../../lib";
import {
  InstillAIOpenAPIProperty,
  extractPipelineComponentReferenceFromString,
} from "../../lib";
import { usePipelineBuilderStore } from "../../usePipelineBuilderStore";

export const InputPropertyItem = (props: {
  propertyPath: Nullable<string>;
  children: React.ReactElement;
}) => {
  const { propertyPath, children } = props;

  return (
    <div className="w-full rounded-[6px] bg-semantic-bg-primary p-2">
      <div className="flex flex-row flex-wrap justify-between gap-x-2 gap-y-2">
        <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
          {propertyPath?.split(".").pop()}
        </p>
        {children}
      </div>
    </div>
  );
};

const InputPropertyValue = (props: {
  property: InstillAIOpenAPIProperty;
  connectorConfiguration: GeneralRecord;
  traces: Nullable<TriggerUserPipelineResponse["metadata"]["traces"]>;
}) => {
  const { property, connectorConfiguration, traces } = props;

  const propertyConfiguration = property.path
    ? dot.getter(connectorConfiguration, property.path)
    : null;

  const reference = extractPipelineComponentReferenceFromString({
    value: propertyConfiguration,
    nodeId: null,
    currentPath: property.path ? property.path?.split(".") : [],
    key: null,
  });

  const testModeEnabled = usePipelineBuilderStore(
    (state) => state.testModeEnabled
  );

  if (!reference || !reference.nodeId) {
    return propertyConfiguration !== null ||
      propertyConfiguration !== undefined ? (
      <div className="min-h-[32px] min-w-[100px] break-all rounded-sm text-semantic-fg-secondary border border-semantic-bg-line px-2 py-1.5 product-body-text-3-regular">
        {`${propertyConfiguration}`}
      </div>
    ) : null;
  }

  if (testModeEnabled && traces) {
    const traceValue = traces[reference.nodeId].inputs[0][reference.path];

    return (
      <div className="min-h-[32px] break-all min-w-[100px] rounded-sm border border-semantic-bg-line px-2 py-1.5 product-body-text-3-regular">
        {traceValue}
      </div>
    );
  } else {
    if (reference.type === "singleCurlyBrace") {
      return (
        <Tag size="md" variant="lightBlue">
          {reference.referenceValue.withoutCurlyBraces}
        </Tag>
      );
    } else {
      return (
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
          <Tag size="md" variant="lightBlue">
            {reference.referenceValues[0].withoutCurlyBraces}
          </Tag>
          {reference.referenceValues.length > 1 ? (
            <Tag size="md" variant="lightBlue" className="cursor-pointer">
              {`+ ${reference.referenceValues.length - 1}`}
            </Tag>
          ) : null}
        </div>
      );
    }
  }
};
InputPropertyItem.Value = InputPropertyValue;
