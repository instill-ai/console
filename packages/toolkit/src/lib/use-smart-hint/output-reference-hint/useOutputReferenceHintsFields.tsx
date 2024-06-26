import * as React from "react";

import { Nullable } from "../../type";
import { PipelineComponent } from "../../vdp-sdk";
import { pickFieldsFromOutputReferenceHints } from "./pickFieldsFromOutputReferenceHints";
import { pickOutputReferenceHintsFromComponent } from "./pickOutputReferenceHintsFromComponent";

export function useOutputReferenceHintFields({
  componentID,
  component,
  task,
}: {
  componentID: string;
  component: Nullable<PipelineComponent>;
  task?: string;
}) {
  const fields = React.useMemo(() => {
    if (!component) {
      return [];
    }

    const hints = pickOutputReferenceHintsFromComponent({
      componentID,
      component,
      task,
    });
    const fields = pickFieldsFromOutputReferenceHints(hints);

    return fields;
  }, [componentID, component, task]);

  return fields;
}
