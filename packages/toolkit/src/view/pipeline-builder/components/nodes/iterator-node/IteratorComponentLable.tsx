"use client";

import * as React from "react";
import { Nullable, PipelineComponent } from "../../../../../lib";
import {
  isConnectorComponent,
  isOperatorComponent,
} from "../../../lib/checkComponentType";
import { ImageWithFallback } from "../../../../../components";
import { Icons } from "@instill-ai/design-system";

export const IteratorComponentLabel = ({
  component,
}: {
  component: PipelineComponent;
}) => {
  const [definitionID, setDefinitionID] =
    React.useState<Nullable<string>>(null);

  React.useEffect(() => {
    if (isConnectorComponent(component)) {
      setDefinitionID(component.connector_component.definition?.id ?? null);
    }

    if (isOperatorComponent(component)) {
      setDefinitionID(component.operator_component.definition?.id ?? null);
    }
  }, [component]);

  return (
    <div className="flex ">
      {definitionID ? (
        <div className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-2 py-1.5">
          <ImageWithFallback
            src={`/icons/${definitionID}.svg`}
            width={12}
            height={12}
            alt={`${definitionID}-icon`}
            fallbackImg={
              <Icons.Box className="h-3 w-3 stroke-semantic-fg-primary" />
            }
          />
          <p className="text-xs font-semibold leading-3 text-semantic-fg-primary">
            {component.id}
          </p>
        </div>
      ) : null}
    </div>
  );
};
