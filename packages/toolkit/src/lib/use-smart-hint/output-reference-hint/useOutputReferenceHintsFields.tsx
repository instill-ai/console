import * as React from "react";

import { Nullable } from "../../type";

import { PipelineComponent } from "../../vdp-sdk";
import { pickOutputReferenceHintsFromComponent } from "./pickOutputReferenceHintsFromComponent";
import { pickFieldsFromOutputReferenceHints } from "./pickFieldsFromOutputReferenceHints";

export function useOutputReferenceHintFields({
  component,
  task,
}: {
  component: Nullable<PipelineComponent>;
  task?: string;
}) {
  const fields = React.useMemo(() => {
    if (!component) {
      return [];
    }

    const hints = pickOutputReferenceHintsFromComponent({
      component,
      task,
    });
    const fields = pickFieldsFromOutputReferenceHints(hints);

    return fields;
  }, [component, task]);

  return fields;
}
